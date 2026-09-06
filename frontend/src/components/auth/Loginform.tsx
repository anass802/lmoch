import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login, saveSession } from "../../api/auth/AuthService";
import logo from '../../assets/images/logo/lmoch.png'
import { useNavigate } from "react-router-dom";
import type { LoginPayload } from "../../types/auth";

export default function LoginForm() {
    const [form, setForm] = useState<LoginPayload>({ email: "", password: "" } as LoginPayload);
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const { data } = await login(form);
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
            const role = data.user.role?.name;

            if (role === "admin") {
                window.location.href = "/admin";
            } else if (role === "client") {
                window.location.href = "/";
            }

        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Email ou mot de passe incorrect");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 py-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex flex-col items-center mb-6">
                    <img src={logo} alt="Lmoch.com" className="h-16 w-16 mb-3" />
                    <h3 className=" font-semibold text-gray-900">
                        Bienvenue chez <span className="text-orange-500">Lm<span className="text-[#1E3A6E]">och</span>.com</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Connectez-vous à votre compte</p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email ou numéro de téléphone
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="exemple@email.com"
                                required
                                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <a href="/forgot-password" className="text-xs text-orange-500 hover:underline">
                                Mot de passe oublié ?
                            </a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                        />
                        Se souvenir de moi
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                    >
                        {loading ? "Connexion..." : "Se connecter →"}
                    </button>
                </form>





                <p className="text-center text-sm text-gray-500 mt-6">
                    Vous n'avez pas de compte ?{" "}
                    <div onClick={() => navigate('/auth/account/register')} className="text-orange-500 font-medium hover:underline">
                        Créer un compte
                    </div>
                </p>
            </div>
        </div>
    );
}