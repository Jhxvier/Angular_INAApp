export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export interface Usuario {
  id: number;
  username: string;
  password?: string;
  role: UserRole;
}