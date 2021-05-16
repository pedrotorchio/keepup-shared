import { PartialDeep } from "type-fest";

export type Primitive = import("type-fest").Primitive;
export type NullableObjectFields<T extends Record<string, any>> = {
  [key in keyof T]?: null | T[key];
};
export type Nullable<T> = T | null;
export type PartialNullableDeep<T> = PartialDeep<NullableDeep<T>>;
export type NullableDeep<T> = T extends Primitive
	? Nullable<T>
	: T extends Map<infer KeyType, infer ValueType>
	? NullableMapDeep<KeyType, ValueType>
	: T extends Set<infer ItemType>
	? NullableSetDeep<ItemType>
	: T extends ReadonlyMap<infer KeyType, infer ValueType>
	? NullableReadonlyMapDeep<KeyType, ValueType>
	: T extends ReadonlySet<infer ItemType>
	? NullableReadonlySetDeep<ItemType>
	: T extends ((...args: any[]) => unknown)
	? T | undefined
	: T extends object
	? NullableObjectDeep<T>
	: unknown;

export interface NullableMapDeep<KeyType, ValueType> extends Map<NullableDeep<KeyType>, NullableDeep<ValueType>> {}

/**
Same as `NullableDeep`, but accepts only `Set`s as inputs. Internal helper for `NullableDeep`.
*/
export interface NullableSetDeep<T> extends Set<NullableDeep<T>> {}

/**
Same as `NullableDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `NullableDeep`.
*/
export interface NullableReadonlyMapDeep<KeyType, ValueType> extends ReadonlyMap<NullableDeep<KeyType>, NullableDeep<ValueType>> {}

/**
Same as `NullableDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `NullableDeep`.
*/
export interface NullableReadonlySetDeep<T> extends ReadonlySet<NullableDeep<T>> {}

/**
Same as `NullableDeep`, but accepts only `object`s as inputs. Internal helper for `NullableDeep`.
*/
export type NullableObjectDeep<ObjectType extends object> = {
  [KeyType in keyof ObjectType]?: NullableDeep<ObjectType[KeyType]>
};
  
export type Prop<T> = () => T;
export type ExtraData = { [k: string]: any };
export type StaticThis<T> = { new (): T };
