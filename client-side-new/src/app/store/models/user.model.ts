export interface User {
  _id?: string;
  name: string;
  email: string;
  userName: string;
  image?: string;
  accessToken?: string;
}

export interface LoginCred {
  userName: string;
  password: string;
}

export interface RegisterCred extends User {
  password: string;
}
