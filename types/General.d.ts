type Primitive = import("type-fest").Primitive;
type NullableObjectFields<T extends Record<string, any>> = {
  [key in keyof T]?: null | T[key];
};
declare type Nullable<T> = T | null;
declare type NullableDeep<T> = T extends Primitive
  ? Nullable<T>
  : T extends object
  ? NullableObjectFields<T>
  : unknown;
declare type Prop<T> = () => T;
declare type ExtraData = { [k: string]: any };