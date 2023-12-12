export interface NewUser {
  email: string;
  name: string;
  password: string;
}

export interface RegistrationResponse {
  type: string;
  message: string;
}

export interface LoginResponse {
  token: string;
  uid: string;
  type: string;
  message: string;
}
