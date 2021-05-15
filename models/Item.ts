import { Primitive } from "type-fest";
import { Nullable } from "../types/General";
import { IModelBase } from "./ModelBase";

export interface IItemPayload<T extends Primitive> {
  label: string;
  value: T;
  items: IItemPayload<T>[];
  tags: string[];
}
export interface IItemModel<T extends Primitive> extends IModelBase<IItemPayload<T>> {
  label: string;
  value: T;
  hasDeepLevels: boolean;
  items: IItemModel<T>[];
  tags: string[];
  hasTag(tag: string): boolean;
}
export default class Item<T extends Primitive = string> implements IItemModel<T> {
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
  toJSON(): IItemPayload<T> {
    return {
      label: this.label,
      value: this.value,
      items: this.items.map(i => i.toJSON()),
      tags: this.tags
    }
  }
  static fromJSON<T extends Primitive>({ label, value, tags, items }: IItemPayload<T>): Item<T> {
    const item = new Item(label, value);
    item.tags = tags;
    item.items = items.map(i => Item.fromJSON(i));
    return item;
  }
  clone(): Item<T> {
    return Item.fromJSON(this.toJSON());
  }
}