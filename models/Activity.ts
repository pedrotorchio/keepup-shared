import { PartialDeep } from 'type-fest';
export interface ActivityPayload {
  uuid?: string;
  root_user?: string;
  record_id?: string;
  data?: PartialDeep<NullableDeep<ActivityData>>;
  creator_identifier?: Nullable<string>;
  archived?: boolean;
  updated_at?: string;
  created_at?: string;
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
    record.rootUser = data.root_user ?? null
    record.data = {
      ...mkData(),
      ...data.data
    }
    record.creatorIdentifier = data.creator_identifier ?? null;
    record.recordId = data.record_id ?? null;
    record.updatedAt = data.updated_at ?? null;
    record.createdAt = data.created_at ?? null;
    record.archived = data.archived ?? false
    return record;
  }
  toJSON(): ActivityPayload {
    return {
      uuid: this.uuid ?? undefined,
      root_user: this.rootUser ?? undefined,
      created_at: this.createdAt ?? undefined,
      updated_at: this.updatedAt ?? undefined,
      record_id: this.recordId ?? undefined,
      creator_identifier: this.creatorIdentifier ?? undefined,
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