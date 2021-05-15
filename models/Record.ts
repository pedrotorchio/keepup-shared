import { PartialDeep } from 'type-fest';
import { PartialNullableDeep, ExtraData, NullableDeep, Nullable } from '../types/General';
import { ModelBase } from './ModelBase';
export interface RecordPayload {
  uuid: Nullable<string>;
  rootUser: string;
  patientId: string;
  data: RecordData;
  archived: boolean;
  createdAt: Nullable<string>;
  updatedAt: Nullable<string>;
}
export interface RecordData extends ExtraData {
  title: string;
  timestamp: string;
}
export interface RecordModel extends RecordPayload, ModelBase<RecordPayload> {}
const mkEmptyData = (): RecordData => ({
  timestamp: "",
  title: ""
})
export default class Record implements RecordModel {
  uuid: Nullable<string> = null
  rootUser: string = ""
  patientId: string = ""
  data: RecordData = mkEmptyData();
  archived: boolean = false
  createdAt: Nullable<string> = null
  updatedAt: Nullable<string> = null

  static fromJSON(data: RecordPayload) {
    const record = new Record();
    record.uuid = data.uuid ?? null
    record.rootUser = data.rootUser ?? null
    record.patientId = data.patientId ?? null
    record.createdAt = data.createdAt ?? null;
    record.updatedAt = data.updatedAt ?? null;
    record.data = {
      ...mkEmptyData(),
      ...data.data
    };
    record.archived = data.archived ?? false
    return record;
  }
  toJSON(): RecordPayload {
    return {
      uuid: this.uuid,
      rootUser: this.rootUser,
      patientId: this.patientId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      archived: this.archived,
      data: this.data
    }
  }
  clone() {
    return Record.fromJSON(JSON.parse(JSON.stringify(this)));
  }

}