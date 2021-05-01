import { PartialDeep } from 'type-fest';
export interface UserPayload {
  id: string;
  username: string;
  email: string;
  name: string;
  archived: boolean;
  details: NullableDeep<UserDetails>;
  updated_at: string;
  created_at: string;
}
export interface UserDetails extends ExtraData {
  avatar_url: string;
}
const mkDetails = (): NullableDeep<UserDetails> => ({
  avatar_url: null
});
export default class User {
  id: Nullable<string> = null;
  username: Nullable<string> = null;
  email: Nullable<string> = null;
  name: Nullable<string> = null;
  archived: Nullable<boolean> = null;
  details: NullableDeep<UserDetails> = mkDetails();
  updated_at: Nullable<string> = null;
  created_at: Nullable<string> = null;


  static fromJSON(data: PartialDeep<UserPayload>): User {
    const user = new User();
    user.id = data?.id ?? null;
    user.username = data?.username ?? null;
    user.email = data?.email ?? null;
    user.name = data?.name ?? null;
    user.archived = data?.archived ?? null;
    user.details = data?.details ?? mkDetails();
    user.updated_at = data?.updated_at ?? null;
    user.created_at = data?.created_at ?? null;
    return user;
  }
  toJSON(): NullableDeep<UserPayload> {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      name: this.name,
      archived: this.archived,
      details: this.details,
      updated_at: this.updated_at,
      created_at: this.created_at
    }
  }
  clone() {
    return User.fromJSON(JSON.parse(JSON.stringify(this)));
  }
}