export interface ModelBase<Payload> {
  toJSON(): Payload;
  clone(): ModelBase<Payload>;
}