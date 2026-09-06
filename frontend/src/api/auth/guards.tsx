import { getRole,getToken } from "./AuthService";
import { Navigate } from "react-router-dom";


export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const token = getToken();
  const role = getRole();
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}