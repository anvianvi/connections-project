export interface NewUser {
  email: string;
  name: string;
  password: string;
}

export interface ServerResponse {
  status: number;
  error?: ErrorResponse;
}

export interface ErrorResponse {
  type: string;
  message: string;
}

export interface LoginResponse {
  token: string;
  uid: string;
  type: string;
  message: string;
}

export interface GetProfileResponse {
  email: {
    S: string;
  };
  name: {
    S: string;
  };
  uid: {
    S: string;
  };
  createdAt: {
    S: string;
  };
}
