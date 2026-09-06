import LoginForm from "../components/auth/Loginform";
import AccountInfo from "../components/auth/AccountInfo";
import { getToken } from "../api/auth/AuthService";

export default function Account() {
  const isLoggedIn = !!getToken();

  return isLoggedIn ? <AccountInfo /> : <LoginForm />;
}