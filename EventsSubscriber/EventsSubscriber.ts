export type Callback = (...args: any[]) => void;
export type EventsDictionary = {
  [index: string]: Callback;
}
export class EventsSubscriber<Events extends EventsDictionary> {
  private _listeners = {} as {
    [Key in keyof Events]: Events[Key][];
  };
  
  listen<Event extends keyof Events>(event: Event, cb: Events[Event]): string {
    if (!this._listeners[event]) this._listeners[event] = [];

    this._listeners[event].push(cb);
    return `${event}.${this._listeners[event].length - 1}`;
  }
  publish<Event extends keyof Events>(event: Event, ...parameters: Parameters<Events[Event]>): void {
    if (!this._listeners[event]) return;
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