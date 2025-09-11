export interface UserData {
  name: string;
  role: string;
}

export interface IJwtPayload {
  role: "USER" | "TENANT" | "ADMIN";
  id: string;
  email: string;
}