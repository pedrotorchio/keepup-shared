import { Moment } from "moment";
import { Nullable } from "../types";

export interface IModelBase<Payload> {
  toJSON(): Payload;
  clone(): IModelBase<Payload>;
  createdAt: Nullable<Moment>;
  updatedAt: Nullable<Moment>;
}
export interface IModeBasePayload {
  updatedAt: Nullable<string>
  createdAt: Nullable<string>
}