import { useState,useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Pencil,
  LogOut,
  Coins,
  ShieldCheck,
  Check,
  X,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  getUserName,
  getUserEmail,
  getPhone,
  getpointsBalance,
  getRole,
  clearSession,
  updateUser,
  updateUserInfo,
  deleteAccount,
  updatePointsBalance
} from '../../api/auth/AuthService'
import api from "../../api/api";

type FieldKey = "name" | "email" | "phone";

export default function AccountInfo() {
  const [editing, setEditing] = useState<FieldKey | null>(null);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const name = getUserName() ?? "—";
  const email = getUserEmail() ?? "—";
  const phone = getPhone() ?? "—";
  const [points, setPoints] = useState<number>(Number(getpointsBalance()) || 0);
  const role = getRole();

  useEffect(()=>{
    const refreshUser = async () => {
        const res = await api.get('/auth/me'); 
        const user = res.data;

        updateUserInfo({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });

        updatePointsBalance(user.points_balance);
        setPoints(user.points_balance);
    };
    refreshUser();
  },[])

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const fields: { key: FieldKey; label: string; value: string; icon: React.ReactNode }[] = [
    { key: "name", label: "Nom complet", value: name, icon: <User className="h-4 w-4 text-gray-400" /> },
    { key: "email", label: "Email", value: email, icon: <Mail className="h-4 w-4 text-gray-400" /> },
    { key: "phone", label: "Téléphone", value: phone, icon: <Phone className="h-4 w-4 text-gray-400" /> },
  ];

  const handleLogout = () => {
    clearSession();
    window.location.href = "/auth/account/login";
  };

  const startEditing = (f: FieldKey, currentValue: string) => {
    setEditing(f);
    setValue(currentValue);
    setError(null);
  };

  const cancelEditing = () => {
    setEditing(null);
    setError(null);
  };

  const saveEditing = async (f: FieldKey) => {
    if (!value.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await updateUser(f, value);
      updateUserInfo({ [f]: value });
      setEditing(null);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "SUPPRIMER") return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount();
      clearSession();
      window.location.href = "/auth/account/login";
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message ?? "Erreur lors de la suppression du compte");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header card */}
        <div className="bg-[#1B2A4A] rounded-2xl px-6 py-8 sm:px-10 sm:py-10 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/10" />
          <div className="absolute -right-2 bottom-0 h-24 w-24 rounded-full bg-orange-500/10" />

          <div className="relative flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold">
              {initials || <User className="h-7 w-7" />}
            </div>
            <div>
              <h3 className="text-white text-lg sm:text-xl font-bold">{name}</h3>
              <p className="text-slate-300 text-sm mt-0.5">{email}</p>
              {role && (
                <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-orange-300 bg-orange-500/15 px-2 py-1 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {role}
                </span>
              )}
            </div>
          </div>

          <div className="relative mt-6 flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <Coins className="h-5 w-5 text-orange-400" />
              <span className="text-sm font-medium">Solde de points</span>
            </div>
            <span className="text-white text-lg font-bold">{points} pts</span>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Informations personnelles
          </h2>

          <div className="space-y-3">
            {fields.map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {f.icon}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400">{f.label}</p>
                    {editing === f.key ? (
                      <>
                        <input
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          autoFocus
                          disabled={saving}
                          className="mt-0.5 w-full text-sm font-medium text-gray-900 border-b border-orange-400 focus:outline-none bg-transparent"
                        />
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                      </>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 truncate">{f.value}</p>
                    )}
                  </div>
                </div>

                {editing === f.key ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => saveEditing(f.key)}
                      disabled={saving}
                      className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-50"
                      aria-label="Enregistrer"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                      aria-label="Annuler"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEditing(f.key, f.value)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 shrink-0"
                    aria-label={`Modifier ${f.label}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Password */}
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-8 mb-4">
            Sécurité
          </h2>
          <button
            type="button"
            className="w-full flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left hover:border-orange-300 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">Mot de passe</p>
              <p className="text-xs text-gray-400 mt-0.5">••••••••</p>
            </div>
            <span className="text-xs font-medium text-orange-500">Changer</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 font-medium text-sm py-3 mt-8 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 mt-6 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Zone dangereuse
          </h2>

          {!confirmingDelete ? (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-medium text-sm py-3 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer mon compte
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                Cette action est <span className="font-semibold">irréversible</span>. Toutes vos données seront définitivement supprimées.
              </p>
              <p className="text-sm text-gray-500">
                Tape <span className="font-mono font-semibold">SUPPRIMER</span> pour confirmer :
              </p>
              <input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                disabled={deleting}
                placeholder="SUPPRIMER"
                className="w-full text-base border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-400"
              />
              {deleteError && <p className="text-xs text-red-500">{deleteError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "SUPPRIMER" || deleting}
                  className="flex-1 rounded-xl bg-red-600 text-white font-medium text-sm py-2.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
                >
                  {deleting ? "Suppression..." : "Confirmer la suppression"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmingDelete(false);
                    setDeleteConfirmText("");
                    setDeleteError(null);
                  }}
                  disabled={deleting}
                  className="rounded-xl border border-gray-300 text-gray-600 font-medium text-sm px-4 py-2.5 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}