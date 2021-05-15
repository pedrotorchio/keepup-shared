import { Nullable, ExtraData, NullableDeep, PartialNullableDeep, NullableObjectFields } from '../types/General';
import { ModelBase } from './ModelBase';

export interface ActivityData extends ExtraData {
  shortDescription: string;
  longDescription: string;
  startTime: string;
  duration: number;
  autonomy: number;
}
export interface ActivityPayload {
  uuid: Nullable<string>
  rootUser: string
  recordId: string
  data: ActivityData,
  archived: boolean
  creatorIdentifier: string
  updatedAt: Nullable<string>
  createdAt: Nullable<string>
}
export interface IActivityModel extends ModelBase<ActivityPayload> {
  uuid: Nullable<string>
  rootUser: string
  recordId: string
  data: ActivityData
  archived: boolean
  creatorIdentifier: string
  updatedAt: Nullable<string>
  createdAt: Nullable<string>
}

const mkData = (): ActivityData => ({
  autonomy: 0,
  duration: 0,
  longDescription: "",
  shortDescription: "",
  startTime: ""
});
export default class Activity implements IActivityModel {
  uuid: Nullable<string> = null
  rootUser: string = ""
  data: ActivityData = mkData();
  archived: boolean = false
  creatorIdentifier: string = "";
  createdAt: Nullable<string> = null
  updatedAt: Nullable<string> = null
  recordId: string = "";


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

  toJSON(): ActivityPayload {
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