import Axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { EventsSubscriber } from '../EventsSubscriber/EventsSubscriber';

const hasStatus = (error: AxiosError, st: number) => error?.response?.status == st;
type HttpClientInfo = { 
  client: AxiosInstance, 
  eventsSubscriber: EventsSubscriber<{}>, 
  setSessionToken: (t: string) => void,
  requestCounter: { active: number }
};
export function createNewHttpClient(BASE_URL: string): HttpClientInfo {
  const eventsSubscriber = new EventsSubscriber();
  const axiosInstance = Axios.create({
    baseURL: BASE_URL
  });
  const requestCounter = { active: 0 };
  axiosInstance.interceptors.request.use((c) => {
    requestCounter.active++;
    eventsSubscriber.publish('request', { configuration: c });
    return c;
  })
  
  axiosInstance.interceptors.response.use((r: AxiosResponse) => {
    requestCounter.active--;
    eventsSubscriber.publish('response', { response: r });
    const token = r.headers.token;
    if (token) setSessionToken(token);
    return r;
  }, (error: AxiosError) => {
    requestCounter.active--;
    eventsSubscriber.publish('error-response', { error });
    console.error(error);
    if (hasStatus(error, 401)||hasStatus(error, 403)) clearToken();
    throw error;
  });

  function setSessionToken(token: string) {
    axiosInstance.defaults.headers["token"] = token;
    eventsSubscriber.publish("newToken", token);
  }
  function clearToken() {
    eventsSubscriber.publish("clearToken");
  }
  return {
    setSessionToken,
    client: axiosInstance,
    eventsSubscriber,
    requestCounter
  }
}