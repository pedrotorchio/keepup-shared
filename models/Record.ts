import { PartialDeep } from 'type-fest';
import { PartialNullableDeep, ExtraData, NullableDeep, Nullable } from '../types/General';
export interface RecordPayload {
  uuid?: string;
  root_user?: string;
  patient_id?: string;
  data: PartialNullableDeep<RecordData>;
  archived?: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface RecordData extends ExtraData {
  title: string;
  timestamp: string;
}
const mkEmptyData = (): NullableDeep<RecordData> => ({
  timestamp: null,
  title: null
})
export default class Record {
  uuid: Nullable<string> = null
  rootUser: Nullable<string> = null
  patientId: Nullable<string> = null
  data: NullableDeep<RecordData> = mkEmptyData();
  archived: boolean = false
  createdAt: Nullable<string> = null
  updatedAt: Nullable<string> = null

  static fromJSON(data: RecordPayload) {
    const record = new Record();
    record.uuid = data.uuid ?? null
    record.rootUser = data.root_user ?? null
    record.patientId = data.patient_id ?? null
    record.createdAt = data.patient_id ?? null;
    record.updatedAt = data.updated_at ?? null;
    record.data = {
      ...mkEmptyData(),
      ...data.data
    };
    record.archived = data.archived ?? false
    return record;
  }
  toJSON(): RecordPayload {
    return {
      uuid: this.uuid ?? undefined,
      root_user: this.rootUser ?? undefined,
      patient_id: this.patientId ?? undefined,
      created_at: this.createdAt ?? undefined,
      updated_at: this.updatedAt ?? undefined,
      archived: this.archived,
      data: this.data
    }
  }
  clone() {
    return Record.fromJSON(JSON.parse(JSON.stringify(this)));
  }

}