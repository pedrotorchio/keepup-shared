export type Callback = (...args: any[]) => void;
export type EventsDictionary = {
  [k: string]: Callback[];
}
export class EventsSubscriber<Events extends EventsDictionary> {
  private _listeners = {} as Events;
  
  listen<Event extends keyof Events>(event: Event, cb: Events[Event][0]): string {
    this._listeners[event].push(cb);
    return `${event}.${this._listeners[event].length - 1}`;
  }
  publish<Event extends keyof Events>(event: Event, ...parameters: Parameters<Events[Event][0]>): void {
    const allListeners: Callback[] = this._listeners[event];
    allListeners.forEach(listen => listen(...parameters));
  }
  unlisten(code: string): void {
    const [event, indexstr] = code.split('.')
    const index = parseInt(indexstr);
    if (!event || isNaN(index)) throw new Error(`Invalid unlisten code (${code})`);

    this._listeners[event].splice(index, 1);
  }
}