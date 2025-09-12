export enum UserRole {
  USER = "USER",
  TENANT = "TENANT",
  ADMIN = "ADMIN",
}

export interface ProfilePageParam {
  role: UserRole;
  isVerified: boolean;
  name: string;
  email: string;
  phone?: string;
}
