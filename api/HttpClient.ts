import Axios, { AxiosInstance, AxiosResponse } from 'axios';

type RequestCounterListener = (n: number) => void;
class RequestCounter {
  private _value: number = 0;
  private _listeners: RequestCounterListener[] = [];

  private publish() {
    this._listeners.forEach(list => list(this.value));
  }
  get value(): number {
    return this._value;
  }
  increase() {
    this._value++;
    this.publish();
  }
  decrease() {
    this._value--;
    this.publish();
  }
  listen(callback: RequestCounterListener) {
    this._listeners.push(callback);
    callback(this.value);
  }
}

type EventName = 'newToken'|'clearToken'|'requestCount';//|'response';
class EventsSubscriber {
  private _newTokenListeners: ((token: string) => void)[] = [];
  private _clearTokenListeners: (() => void)[] = [];
  private _requestCounter: RequestCounter;
  // private _responseListeners: ((response: AxiosResponse) => void)[] = [];

  constructor(rc: RequestCounter) {
    this._requestCounter = rc;
  }
  
  listen(event: 'newToken', cb: (t: string) => void): void;
  listen(event: 'clearToken', cb: () => void): void;
  listen(event: 'requestCount', cb: () => void): void;
  // listen(event: 'response', cb: (response: AxiosResponse) => void): void;
  listen(event: EventName, cb: any) {
    switch(event) {
      case 'newToken': this._newTokenListeners.push(cb); break;
      case 'clearToken': this._clearTokenListeners.push(cb); break;
      case 'requestCount': this._requestCounter.listen(cb); break;
      // case 'response': this._responseListeners.push(cb); break;
    }
  }
  publish(event: 'newToken', token: string): void;
  publish(event: 'clearToken'): void;
  // publish(event: 'response', response: AxiosResponse): void;
  publish(event: EventName, value?: any) {
    switch(event) {
      case 'newToken': this._newTokenListeners.forEach(l => l(value as string)); break;
      case 'clearToken': this._clearTokenListeners.forEach(l => l()); break;
      // case 'response': this._responseListeners.forEach(l => l(value as AxiosResponse)); break;
    }
  }

}

export function createNewHttpClient(BASE_URL: string) {
  const openRequestsCounter = new RequestCounter();
  const eventsSubscriber = new EventsSubscriber(openRequestsCounter);
  const increaseOpenRequestCount = () => openRequestsCounter.increase();
  const decreaseOpenRequestCount = () => openRequestsCounter.decrease();
  const axiosInstance = Axios.create({
    baseURL: BASE_URL
  });

  addInterceptors({
    axiosInstance,
    decreaseOpenRequestCount,
    clearToken,
    setSessionToken,
    eventsSubscriber
  });

  const axiosInstanceWrapper = new Proxy(axiosInstance, {
    get: function(...parameters) {
      const [,prop,] = parameters;
      if (typeof prop === 'string' && [
        "get",
        "post",
        "put",
        "delete"
      ].includes(prop)) {
        increaseOpenRequestCount();
        return Reflect.get(...parameters);
      }
      return Reflect.get(...parameters);
    }
  });
  function setSessionToken(token: string) {
    axiosInstance.defaults.headers["token"] = token;
    eventsSubscriber.publish("newToken", token);
  }
  function clearToken() {
    eventsSubscriber.publish("clearToken");
  }
  return {
    axiosInstanceWrapper,
    eventsSubscriber
  }
}

function addInterceptors(options: {
  axiosInstance: AxiosInstance,
  setSessionToken: (token: string) => void,
  clearToken: () => void,
  decreaseOpenRequestCount: () => void,
  eventsSubscriber: EventsSubscriber
}) {
  const {
    axiosInstance,
    setSessionToken,
    decreaseOpenRequestCount,
    clearToken,
  } = options;
  axiosInstance.interceptors.response.use(function (response: AxiosResponse) {
    const token = response.headers.token;
    if (token) setSessionToken(token);
    decreaseOpenRequestCount();
    return response;
  }, function (error: any) {
    console.error(error);
    decreaseOpenRequestCount();
    const hasStatus = (st: number) => error?.response?.status == st;
    if (hasStatus(401)||hasStatus(403)) {
      clearToken();
    }
    throw error;
  });
}