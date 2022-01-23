type Callback = (...args: any[]) => void;
type EventsDictionary = {
  [k: string]: Callback[];
}
export class EventsSubscriber<Events extends EventsDictionary> {
  private _listeners = {} as Events;
  
  listen<Event extends keyof Events>(event: Event, cb: Events[Event][0]): void {
    this._listeners[event].push(cb);
  }
  publish<Event extends keyof Events>(event: Event, ...parameters: Parameters<Events[Event][0]>): void {
    const allListeners: Callback[] = this._listeners[event];
    allListeners.forEach(listen => listen(...parameters));
  }

}