import { PartialDeep } from 'type-fest';
import { NullableDeep, ExtraData, Nullable } from '../types/General';
import { ModelBase } from './ModelBase';
export interface UserPayload {
  id: Nullable<string>;
  username: string;
  email: string;
  name: string;
  archived: boolean;
  details: UserDetails;
  createdAt: Nullable<string>;
  updatedAt: Nullable<string>;
}
export interface UserDetails extends ExtraData {
  avatarUrl: string;
}
export interface UserModel extends UserPayload, ModelBase<UserPayload> {};
const mkDetails = (): UserDetails => ({
  avatarUrl: ""
});
export default class User implements UserModel {
  id: Nullable<string> = null;
  username: string = "";
  email: string = "";
  name: string = "";
  archived: boolean = false;
  details: UserDetails = mkDetails();
  updatedAt: Nullable<string> = null;
  createdAt: Nullable<string> = null;


  static fromJSON(data: UserPayload): User {
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
    user.updatedAt = data?.updatedAt;
    user.createdAt = data?.createdAt;
    return user;
  }
  toJSON(): UserPayload {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      name: this.name,
      archived: this.archived,
      details: this.details,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt
    }
  }
  clone() {
    return User.fromJSON(JSON.parse(JSON.stringify(this)));
  }
}