export interface NewUser {
  email: string;
  name: string;
  password: string;
}

export interface RegistrationResponse {
  type: string;
  message: string;
}
