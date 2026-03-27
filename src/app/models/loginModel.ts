export interface LoginModel {
  username: string;
  password: string;
}

export interface LoginResponse {
  toke: string;
  role: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
