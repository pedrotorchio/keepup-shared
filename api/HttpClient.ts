import Axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { EventsSubscriber } from '../EventsSubscriber/EventsSubscriber';

const hasStatus = (error: AxiosError, st: number) => error?.response?.status == st;
export function createNewHttpClient(BASE_URL: string): { client: AxiosInstance, eventsSubscriber: EventsSubscriber<{}>, setSessionToken: (t: string) => void } {
  const eventsSubscriber = new EventsSubscriber();
  const axiosInstance = Axios.create({
    baseURL: BASE_URL
  });

  axiosInstance.interceptors.response.use((r: AxiosResponse) => {
    const token = r.headers.token;
    if (token) setSessionToken(token);
    return r;
  }, (error: AxiosError) => {
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
    eventsSubscriber
  }
}