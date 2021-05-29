import moment, { ISO_8601, Moment } from 'moment';
import { PartialDeep } from 'type-fest';
import { NullableDeep, ExtraData, Nullable, PartialNullableDeep } from '../types/General';
import { IModeBasePayload, IModelBase } from './ModelBase';

export interface IExternalRecordFormData extends ExtraData {
  name: string;
}
export interface IExternalRecordFormPayload extends IModeBasePayload {
  uuid: Nullable<string>;
  rootUser: string;
  recordId: string;
  isActive: boolean;
  data: IExternalRecordFormData;
  archived: boolean;
  tempToken: Nullable<string>;
}
export interface IExternalRecordForm extends Omit<IExternalRecordFormPayload, 'createdAt'|'updatedAt'>, IModelBase<IExternalRecordFormPayload> {}

const mkEmptyData = (): IExternalRecordFormData => ({
  name: ""
});
export default class ExternalRecordForm implements IExternalRecordForm {
  uuid: Nullable<string> = null
  rootUser = ""
  data: IExternalRecordFormData = mkEmptyData();
  archived = false
  createdAt: Nullable<Moment> = null
  updatedAt: Nullable<Moment> = null
  isActive = true
  recordId = ""
  tempToken: Nullable<string> = null;

  static fromJSON(data: IExternalRecordFormPayload) {
    const externalRecordForm = new ExternalRecordForm();
    externalRecordForm.uuid = data.uuid;
    externalRecordForm.rootUser = data.rootUser;
    externalRecordForm.isActive = data.isActive;
    externalRecordForm.recordId = data.recordId;
    externalRecordForm.createdAt = data.createdAt ? moment(data.createdAt, ISO_8601) : null;
    externalRecordForm.updatedAt = data.updatedAt ? moment(data.updatedAt, ISO_8601) : null;
    externalRecordForm.data = {
      ...mkEmptyData(),
      ...data.data
    };
    externalRecordForm.archived = data.archived;
    externalRecordForm.tempToken = data.tempToken;
    return externalRecordForm;
  }
  toJSON(): IExternalRecordFormPayload {
    return {
      uuid: this.uuid,
      rootUser: this.rootUser,
      isActive: this.isActive,
      recordId: this.recordId,
      updatedAt: this.updatedAt?.toISOString() ?? null,
      createdAt: this.createdAt?.toISOString() ?? null,
      archived: this.archived,
      data: this.data,
      tempToken: this.tempToken
    }
  }
  clone() {
    return ExternalRecordForm.fromJSON(JSON.parse(JSON.stringify(this)));
  }

}