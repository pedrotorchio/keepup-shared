import moment, { ISO_8601, Moment } from 'moment';
import { ExtraData, Nullable } from '../types/General';
import { IModeBasePayload, IModelBase } from './ModelBase';
export interface IPatientPayload extends IModeBasePayload {
  uuid: Nullable<string>;
  rootUser: string;
  data: IPatientData;
  archived: boolean;
}
export interface IPatientData extends ExtraData {
  name: string;
  age: number;
  scholarity: number;
  occupation: string;
}
export interface IPatientModel extends Omit<IPatientPayload, 'createdAt'|'updatedAt'>, IModelBase<IPatientPayload> {}

const mkEmptyData = (): IPatientData => ({
  age: 0,
  name: "",
  scholarity: 0,
  occupation: ""
})
export default class Patient implements IPatientModel {
  uuid: Nullable<string> = null
  rootUser = ""
  data: IPatientData = mkEmptyData();
  archived = false
  createdAt: Nullable<Moment> = null
  updatedAt: Nullable<Moment> = null

  static fromJSON(data: IPatientPayload): Patient {
    const patient = new Patient();
    patient.uuid = data.uuid
    patient.rootUser = data.rootUser
    patient.updatedAt = data.updatedAt ? moment(data.updatedAt, ISO_8601) : null;
    patient.createdAt = data.createdAt ? moment(data.createdAt, ISO_8601) : null;
    patient.data = {
      ...mkEmptyData(),
      ...data.data
    };
    patient.archived = data.archived ?? false
    return patient;
  }
  toJSON(): IPatientPayload {
    return {
      uuid: this.uuid,
      rootUser: this.rootUser,
      createdAt: this.createdAt?.toISOString() ?? null,
      updatedAt: this.updatedAt?.toISOString() ?? null,
      data: this.data,
      archived: this.archived
    }
  }
  clone(): Patient {
    return Patient.fromJSON(JSON.parse(JSON.stringify(this)));
  }

}