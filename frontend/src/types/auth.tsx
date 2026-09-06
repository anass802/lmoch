export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone:string;
  points_balance:number
  role: {name:"admin" | "client"};
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}