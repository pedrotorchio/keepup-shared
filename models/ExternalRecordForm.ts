import { PartialDeep } from 'type-fest';
import { NullableDeep, ExtraData, Nullable, PartialNullableDeep } from '../types/General';

export interface ExternalRecordFormData extends ExtraData {
  name: string;
}
export interface ExternalRecordFormPayload {
  uuid: Nullable<string>;
  rootUser: string;
  recordId: string;
  isActive: boolean;
  data: ExternalRecordFormData;
  archived: boolean;
  createdAt: Nullable<string>;
  updatedAt: Nullable<string>;
  tempToken: Nullable<string>;
}

const mkEmptyData = (): ExternalRecordFormData => ({
  name: ""
});
export default class ExternalRecordForm {
  uuid: Nullable<string> = null
  rootUser: string = ""
  data: ExternalRecordFormData = mkEmptyData();
  archived: boolean = false
  createdAt: Nullable<string> = null
  updatedAt: Nullable<string> = null
  isActive: boolean = true
  recordId: string = ""
  token: Nullable<string> = null;

  static fromJSON(data: ExternalRecordFormPayload) {
    const externalRecordForm = new ExternalRecordForm();
    externalRecordForm.uuid = data.uuid;
    externalRecordForm.rootUser = data.rootUser;
    externalRecordForm.isActive = data.isActive;
    externalRecordForm.recordId = data.recordId;
    externalRecordForm.createdAt = data.createdAt;
    externalRecordForm.updatedAt = data.updatedAt;
    externalRecordForm.data = {
      ...mkEmptyData(),
      ...data.data
    };
    externalRecordForm.archived = data.archived;
    externalRecordForm.token = data.tempToken;
    return externalRecordForm;
  }
  toJSON(): ExternalRecordFormPayload {
    return {
      uuid: this.uuid,
      rootUser: this.rootUser,
      isActive: this.isActive,
      recordId: this.recordId,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      archived: this.archived,
      data: this.data,
      tempToken: this.token
    }
  }
  clone() {
    return ExternalRecordForm.fromJSON(JSON.parse(JSON.stringify(this)));
  }

}