import { Nullable } from "../types/General";

export default class Item<T = string> {
  private _items: Nullable<Item<T>[]> = null;
  private _tags: string[] = [];
  constructor(private _label: string, private _value?: T) {}

  get label(): string {
    return this._label;
  }
  get value(): T {
    return (this._value??this._label) as T;
  }
  get hasDeepLevels(): boolean {
    return this._items !== null;
  }
  get items(): Item<T>[]{
    return this._items ?? [];
  }
  set items(items: Item<T>[]) {
    this._items = items;
  }
  get tags(): string[] {
    return this._tags;
  }
  set tags(tags: string[]) {
    this._tags = tags;
  }
  set tag(tag: string) {
    this._tags.push(tag);
  }
  hasTag(tag: string) {
    return this._tags.includes(tag);
  }
}