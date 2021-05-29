import moment, { ISO_8601, Moment } from 'moment';
import { PartialDeep } from 'type-fest';
import { PartialNullableDeep, ExtraData, NullableDeep, Nullable } from '../types/General';
import { IModelBase, IModeBasePayload } from './ModelBase';
export interface IRecordPayload extends IModeBasePayload {
  uuid: Nullable<string>;
  rootUser: string;
  patientId: string;
  data: IRecordData;
  archived: boolean;
}
export interface IRecordData extends ExtraData {
  title: string;
  timestamp: string;
}
export interface IRecordModel extends Omit<IRecordPayload, 'createdAt'|'updatedAt'>, IModelBase<IRecordPayload> {}
const mkEmptyData = (): IRecordData => ({
  timestamp: "",
  title: ""
})
export default class Record implements IRecordModel {
  uuid: Nullable<string> = null
  rootUser = ""
  patientId = ""
  data: IRecordData = mkEmptyData();
  archived = false
  createdAt: Nullable<Moment> = null
  updatedAt: Nullable<Moment> = null

  static fromJSON(data: IRecordPayload) {
    const record = new Record();
    record.uuid = data.uuid ?? null
    record.rootUser = data.rootUser ?? null
    record.patientId = data.patientId ?? null
    record.createdAt = data.createdAt ? moment(data.createdAt, ISO_8601) : null;
    record.updatedAt = data.updatedAt ? moment(data.updatedAt, ISO_8601) : null;
    record.data = {
      ...mkEmptyData(),
      ...data.data
    };
    record.archived = data.archived ?? false
    return record;
  }
  toJSON(): IRecordPayload {
    return {
      uuid: this.uuid,
      rootUser: this.rootUser,
      patientId: this.patientId,
      createdAt: this.createdAt?.toISOString() ?? null,
      updatedAt: this.updatedAt?.toISOString() ?? null,
      archived: this.archived,
      data: this.data
    }
  }
  clone() {
    return Record.fromJSON(JSON.parse(JSON.stringify(this)));
  }

}