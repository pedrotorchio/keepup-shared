import { PartialDeep } from 'type-fest';
import { Nullable, ExtraData, NullableDeep, PartialNullableDeep } from '../types/General';
export interface ActivityPayload {
  uuid: string
  rootUser: string
  recordId: string
  data: ActivityDataPayload,
  archived: boolean
  creatorIdentifier: string
  updatedAt: Nullable<string>
  createdAt: Nullable<string>
}
export interface ActivityDataPayload extends ExtraData {
  shortDescription: string;
  longDescription: string;
  startTime: string;
  duration: number;
  autonomy: number;
}
export interface ActivityData extends ExtraData {
  shortDescription: string;
  longDescription: string;
  startTime: string;
  duration: number;
  autonomy: number;
}
const mkData = (): NullableDeep<ActivityData> => ({
  autonomy: null,
  duration: null,
  longDescription: null,
  shortDescription: null,
  startTime: null
});
export default class Activity {
  uuid: Nullable<string> = null
  rootUser: Nullable<string> = null
  data: NullableDeep<ActivityData> = mkData();
  archived: boolean = false
  creatorIdentifier: Nullable<string> = null;
  createdAt: Nullable<string> = null
  updatedAt: Nullable<string> = null
  recordId: Nullable<string> = null


  static fromJSON(data: ActivityPayload) {
    const record = new Activity();
    record.uuid = data.uuid ?? null
    record.rootUser = data.rootUser ?? null
    record.data = {
      ...mkData(),
      ...data.data
    }
    record.creatorIdentifier = data.creatorIdentifier ?? null;
    record.recordId = data.recordId ?? null;
    record.updatedAt = data.updatedAt ?? null;
    record.createdAt = data.createdAt ?? null;
    record.archived = data.archived ?? false
    return record;
  }
  toJSON(): PartialNullableDeep<ActivityPayload> {
    return {
      uuid: this.uuid ?? null,
      rootUser: this.rootUser ?? null,
      createdAt: this.createdAt ?? null,
      updatedAt: this.updatedAt ?? null,
      recordId: this.recordId ?? null,
      creatorIdentifier: this.creatorIdentifier ?? null,
      archived: this.archived ?? false,
      data: this.data
    }
  }
  clone() {
    return Activity.fromJSON(JSON.parse(JSON.stringify(this)));
  }
  get isComplete() {
    return (
      Boolean(this.data.shortDescription) &&
      Boolean(this.data.startTime) &&
      Boolean(this.data.duration)
    )
  }

}