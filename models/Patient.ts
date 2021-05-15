import { PartialDeep } from 'type-fest';
import { PartialNullableDeep, ExtraData, NullableDeep, Nullable } from '../types/General';
import { ModelBase } from './ModelBase';
export interface PatientPayload {
  uuid: Nullable<string>;
  rootUser: string;
  data: PatientData;
  archived: boolean;
  createdAt: Nullable<string>;
  updatedAt: Nullable<string>;
}
export interface PatientData extends ExtraData {
  name: string;
  age: number;
  scholarity: number;
  occupation: string;
}
export interface PatientModel extends PatientPayload, ModelBase<PatientPayload> {}

const mkEmptyData = (): PatientData => ({
  age: 0,
  name: "",
  scholarity: 0,
  occupation: ""
})
export default class Patient implements PatientModel {
  uuid: Nullable<string> = null
  rootUser: string = ""
  data: PatientData = mkEmptyData();
  archived: boolean = false
  createdAt: Nullable<string> = null
  updatedAt: Nullable<string> = null

  static fromJSON(data: PatientPayload): Patient {
    const patient = new Patient();
    patient.uuid = data.uuid
    patient.rootUser = data.rootUser
    patient.updatedAt = data.updatedAt
    patient.createdAt = data.createdAt
    patient.data = {
      ...mkEmptyData(),
      ...data.data
    };
    patient.archived = data.archived ?? false
    return patient;
  }
  toJSON(): PatientPayload {
    return {
      uuid: this.uuid,
      rootUser: this.rootUser,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      data: this.data,
      archived: this.archived
    }
  }
  clone() {
    return Patient.fromJSON(JSON.parse(JSON.stringify(this)));
  }

}