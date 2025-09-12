export enum UserRole {
  USER = "USER",
  TENANT = "TENANT",
  ADMIN = "ADMIN",
}

export interface UserData {
  name: string;
  role: string;
}

export interface IJwtPayload {
  role: UserRole;
  id: string;
  email: string;
}

export interface User {
  id: string;
  first_name?: string;
  email: string;
  phone_number?: string;
  role: "USER" | "TENANT";
  isVerified: boolean;
}