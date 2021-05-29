import moment, { ISO_8601, Moment } from 'moment';
import { PartialDeep } from 'type-fest';
import { NullableDeep, ExtraData, Nullable } from '../types/General';
import { IModeBasePayload, IModelBase } from './ModelBase';
export interface IUserPayload extends IModeBasePayload {
  id: Nullable<string>;
  username: string;
  email: string;
  name: string;
  archived: boolean;
  details: IUserDetails;
}
export interface IUserDetails extends ExtraData {
  avatarUrl: string;
}
export interface IUserModel extends Omit<IUserPayload, 'updatedAt'|'createdAt'>, IModelBase<IUserPayload> {}

const mkDetails = (): IUserDetails => ({
  avatarUrl: ""
});
export default class User implements IUserModel {
  id: Nullable<string> = null;
  username = "";
  email = "";
  name = "";
  archived = false;
  details: IUserDetails = mkDetails();
  updatedAt: Nullable<Moment> = null;
  createdAt: Nullable<Moment> = null;


  static fromJSON(data: IUserPayload): User {
    const user = new User();
    user.id = data?.id;
    user.username = data?.username;
    user.email = data?.email;
    user.name = data?.name;
    user.archived = data?.archived;
    user.details = { 
      ...data?.details,
      ...mkDetails()
    };
    user.updatedAt = data?.updatedAt ? moment(data?.updatedAt, ISO_8601) : null;
    user.createdAt = data?.createdAt ? moment(data?.createdAt, ISO_8601) : null;
    return user;
  }
  toJSON(): IUserPayload {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      name: this.name,
      archived: this.archived,
      details: this.details,
      updatedAt: this.updatedAt?.toISOString() ?? null,
      createdAt: this.createdAt?.toISOString() ?? null
    }
  }
  clone() {
    return User.fromJSON(JSON.parse(JSON.stringify(this)));
  }
}