export enum UserRole {
  USER = "USER",
  TENANT = "TENANT",
  ADMIN = "ADMIN",
}

export interface ILoginParam {
  role?: UserRole;
  email: string;
  password: string;
}

export interface IRegisterParam {
  email: string;
  role?: UserRole;
}

export interface IJwtPayload {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  token: string | null;
  user: IJwtPayload | null;
  loading: boolean;
  error: string | null;
  signIn: (payload: ILoginParam) => Promise<void>;
  signUp: (payload: IRegisterParam) => Promise<void>;
  signOut: () => void;
}
