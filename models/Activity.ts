import moment from 'moment';
import { ISO_8601, Moment } from 'moment';
import { Nullable, ExtraData, NullableDeep, PartialNullableDeep, NullableObjectFields } from '../types/General';
import { IModeBasePayload, IModelBase } from './ModelBase';

export interface IActivityData extends ExtraData {
  shortDescription: string;
  longDescription: string;
  startTime: string;
  duration: number;
  autonomy: number;
}
export interface IActivityPayload extends IModeBasePayload {
  uuid: Nullable<string>
  rootUser: string
  recordId: string
  data: IActivityData,
  archived: boolean
  creatorIdentifier: string
}
export interface IActivityModel extends IModelBase<IActivityPayload> {
  uuid: Nullable<string>
  rootUser: string
  recordId: string
  data: IActivityData
  archived: boolean
  creatorIdentifier: string
}

const mkData = (): IActivityData => ({
  autonomy: 0,
  duration: 0,
  longDescription: "",
  shortDescription: "",
  startTime: ""
});
export default class Activity implements IActivityModel {
  uuid: Nullable<string> = null
  rootUser = ""
  data: IActivityData = mkData();
  archived = false
  creatorIdentifier = "";
  createdAt: Nullable<Moment> = null
  updatedAt: Nullable<Moment> = null
  recordId = "";


  static fromJSON(data: IActivityPayload) {
    const record = new Activity();
    record.uuid = data.uuid ?? null
    record.rootUser = data.rootUser ?? null
    record.data = {
      ...mkData(),
      ...data.data
    }
    record.creatorIdentifier = data.creatorIdentifier;
    record.recordId = data.recordId;
    record.archived = data.archived;
    record.updatedAt = data.updatedAt ? moment(data.updatedAt, ISO_8601) : null;
    record.createdAt = data.createdAt ? moment(data.createdAt, ISO_8601) : null;
    return record;
  }

  toJSON(): IActivityPayload {
    return {
      uuid: this.uuid ?? null,
      rootUser: this.rootUser,
      createdAt: this.createdAt?.toISOString() ?? null,
      updatedAt: this.updatedAt?.toISOString() ?? null,
      recordId: this.recordId,
      creatorIdentifier: this.creatorIdentifier,
      archived: this.archived,
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