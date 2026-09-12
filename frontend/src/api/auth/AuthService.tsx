import type { LoginPayload,AuthResponse, } from "../../types/auth"
import api from "../api"

export const login=(data:LoginPayload)=> api.post<AuthResponse>('/auth/login',data)
export const register = (data: FormData) =>
  api.post<AuthResponse>("/auth/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  export const updatePointsBalance = (pointsBalance: number) => {
  localStorage.setItem("pointsBalance", pointsBalance.toString());
};
export const updateUser = (field: string, value: any) =>
    api.post<{ message: string; field: string }>('/auth/update-user', { field, value })
export const deleteAccount = () => api.delete<{ message: string }>('/auth/delete-account')

export const updateUserInfo = (fields: Partial<{ name: string; email: string; phone: string; role: string }>) => {
  if (fields.name) localStorage.setItem("userName", fields.name);
  if (fields.email) localStorage.setItem("userEmail", fields.email);
  if (fields.phone) localStorage.setItem("phone", fields.phone);
  if (fields.role) localStorage.setItem("role", fields.role);
};

  export const saveSession = (token: string, role: string, name: string,email: string,phone:string,userId:number,pointsBalance:number) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("userName", name);
  localStorage.setItem("userEmail", email);
  localStorage.setItem('phone',phone)
  localStorage.setItem("userId", userId.toString());
  localStorage.setItem("pointsBalance",pointsBalance.toString())
};
export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem('phone')
  localStorage.removeItem("userId");
  localStorage.removeItem("pointsBalance");
};
export const getRole = () => localStorage.getItem("role") as "admin" | "cashier" | null;
export const getToken = () => localStorage.getItem("token");
export const getUserName = () => localStorage.getItem("userName");
export const getUserEmail = () => localStorage.getItem("userEmail");
export const getPhone = () => localStorage.getItem("phone");
export const getpointsBalance=()=>localStorage.getItem("pointsBalance");
export const getUserId=()=> localStorage.getItem("userId");