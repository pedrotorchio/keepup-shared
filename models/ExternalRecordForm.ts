import { PartialDeep } from 'type-fest';
export interface ExternalRecordFormPayload {
  uuid?: string;
  root_user?: string;
  record_id?: string;
  is_active?: boolean;
  data: PartialDeep<NullableDeep<ExternalRecordFormData>>;
  archived?: boolean;
  created_at?: string;
  updated_at?: string;
  temp_token?: string;
}
export interface ExternalRecordFormData extends ExtraData {
  name: string;
}
const mkEmptyData = (): NullableDeep<ExternalRecordFormData> => ({})
export default class ExternalRecordForm {
  uuid: Nullable<string> = null
  rootUser: Nullable<string> = null
  data: ExternalRecordFormPayload["data"] = mkEmptyData();
  archived: boolean = false
  createdAt: Nullable<string> = null
  updatedAt: Nullable<string> = null
  isActive: Nullable<boolean> = true
  recordId: Nullable<string> = null
  token: Nullable<string> = null;

  static fromJSON(data: ExternalRecordFormPayload) {
    const externalRecordForm = new ExternalRecordForm();
    externalRecordForm.uuid = data.uuid ?? null
    externalRecordForm.rootUser = data.root_user ?? null
    externalRecordForm.isActive = data.is_active ?? true
    externalRecordForm.recordId = data.record_id ?? null
    externalRecordForm.createdAt = data.created_at ?? null;
    externalRecordForm.updatedAt = data.updated_at ?? null;
    externalRecordForm.data = {
      ...mkEmptyData(),
      ...data.data
    };
    externalRecordForm.archived = data.archived ?? false
    externalRecordForm.token = data.temp_token ?? null;
    return externalRecordForm;
  }
  toJSON(): ExternalRecordFormPayload {
    return {
      uuid: this.uuid ?? undefined,
      root_user: this.rootUser ?? undefined,
      is_active: this.isActive ?? true,
      record_id: this.recordId ?? undefined,
      updated_at: this.updatedAt ?? undefined,
      created_at: this.createdAt ?? undefined,
      archived: this.archived ?? false,
      data: this.data
    }
  }
  clone() {
    return ExternalRecordForm.fromJSON(JSON.parse(JSON.stringify(this)));
  }

}