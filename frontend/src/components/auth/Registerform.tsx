import { useState } from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from '../../assets/images/logo/lmoch.png'
import { register, saveSession } from "../../api/auth/AuthService";
import PasswordStrengthMeter, { isPasswordValid } from "./PasswordStrengthMeter";
import { useNavigate } from "react-router-dom";

interface RegisterFormState {
  name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  accepted: boolean;
}

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    accepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate=useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const passwordsMatch =
    form.password_confirmation.length > 0 && form.password === form.password_confirmation;

  const canSubmit =
    isPasswordValid(form.password) && passwordsMatch && form.accepted && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid(form.password)) {
      setError("Le mot de passe doit contenir 8+ caractères, une majuscule et un chiffre.");
      return;
    }
    if (!passwordsMatch) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("phone", form.phone);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("password_confirmation", form.password_confirmation);

      const { data } = await register(fd);
      saveSession(
        data.token,
        data.user.role?.name ?? "",
        data.user.name,
        data.user.email,
        data.user.phone,
        data.user.id,
        data.user.points_balance,
      );
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Une erreur est survenue, réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Lmoch.com" className="h-16 w-16 mb-3" />
          <h3 className="font-bold text-gray-900">
            Créer un <span className="text-orange-500">compte</span>
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Rejoignez Lmoch.com et profitez d'une meilleure expérience
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Votre nom complet"
                  required
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  required
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                required
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 caractères"
                required
                className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <PasswordStrengthMeter password={form.password} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showConfirm ? "text" : "password"}
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Confirmez votre mot de passe"
                required
                className={`w-full rounded-lg border pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  form.password_confirmation && !passwordsMatch
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-orange-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.password_confirmation && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-500">Les mots de passe ne correspondent pas.</p>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="accepted"
              checked={form.accepted}
              onChange={handleChange}
              required
              className="mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
            />
            <span>
              J'accepte les{" "}
              <a href="/terms" className="text-orange-500 hover:underline">
                Conditions d'utilisation
              </a>{" "}
              et la{" "}
              <a href="/privacy" className="text-orange-500 hover:underline">
                Politique de confidentialité
              </a>
            </span>
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            {loading ? "Création..." : "Créer mon compte →"}
          </button>
        </form>

       

        <p className="text-center text-sm text-gray-500 mt-6">
          Vous avez déjà un compte ?{" "}
          <span onClick={()=> navigate('/auth/account/login')} className="text-orange-500 font-medium hover:underline">
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
}