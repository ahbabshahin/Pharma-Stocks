import { ActivityLog } from "./common.model";

export interface User {
  _id?: string;
  name: string;
  email: string;
  username: string;
  role?: string;
  image?: string;
  accessToken?: string;
  isPasswordSet?: boolean;
  activity_log?: ActivityLog[];
}

export interface LoginCred {
  username: string;
  password: string;
}

export interface RegisterCred extends User {
  password: string;
}

export interface ForgetPassword{
  _id: string;
  password: string;
}

export interface EditRolePayload{
  _id: string;
  role: string
}
