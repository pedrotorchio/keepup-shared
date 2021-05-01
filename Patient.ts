import { PartialDeep } from 'type-fest';
export interface PatientPayload {
  uuid?: string;
  root_user?: string;
  data: PartialDeep<NullableDeep<PatientData>>;
  archived?: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface PatientData extends ExtraData {
  name: string;
  age: number;
  scholarity: number;
  occupation: string;
}
const mkEmptyData = (): NullableDeep<PatientData> => ({
  age: null,
  name: null,
  scholarity: null,
  occupation: null
})
export default class Patient {
  uuid: Nullable<string> = null
  rootUser: Nullable<string> = null
  data: PatientPayload["data"] = mkEmptyData();
  archived: boolean = false
  createdAt: Nullable<string> = null
  updatedAt: Nullable<string> = null

  static fromJSON(data: PatientPayload) {
    const patient = new Patient();
    patient.uuid = data.uuid ?? null
    patient.rootUser = data.root_user ?? null
    patient.updatedAt = data.updated_at ?? null
    patient.createdAt = data.created_at ?? null
    patient.data = {
      ...mkEmptyData(),
      ...data.data
    };
    patient.archived = data.archived ?? false
    return patient;
  }
  toJSON(): PatientPayload {
    return {
      uuid: this.uuid ?? undefined,
      root_user: this.rootUser ?? undefined,
      created_at: this.createdAt ?? undefined,
      updated_at: this.updatedAt ?? undefined,
      data: this.data,
      archived: this.archived
    }
  }
  clone() {
    return Patient.fromJSON(JSON.parse(JSON.stringify(this)));
  }

}