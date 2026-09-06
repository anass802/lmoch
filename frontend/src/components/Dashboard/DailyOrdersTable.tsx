import { Receipt } from "lucide-react";
import type { DailyOrder } from "../../types/admin";

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700", "bg-fuchsia-100 text-fuchsia-700",
  "bg-amber-100 text-amber-700", "bg-emerald-100 text-emerald-700", "bg-blue-100 text-blue-700",
];

function getInitials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : (parts[0]?.slice(0, 2).toUpperCase() ?? "?");
}
function avatarColor(name?: string) {
  return name ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] : AVATAR_COLORS[0];
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  paid: "bg-emerald-50 text-emerald-600",
  shipped: "bg-blue-50 text-blue-600",
  cancelled: "bg-red-50 text-red-600",
};

type Props = { date: string | null; orders: DailyOrder[]; loading: boolean };

export default function DailyOrdersTable({ date, orders, loading }: Props) {
  const label = date
    ? new Date(date).toLocaleDateString("fr-MA", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
    : null;

  return (
    <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50">
        <h2 className="text-base font-bold text-slate-900">
          {date ? `Commandes du ${label}` : "Sélectionnez un jour"}
        </h2>
        <p className="text-xs text-slate-400">10 dernières commandes {date ? "de ce jour" : ""}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Panier</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Montant</th>
              <th className="px-6 py-4 text-right">Heure</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {loading ? (
              <tr><td colSpan={6} className="p-16 text-center text-slate-400">Chargement...</td></tr>
            ) : !date || orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <p className="font-medium">
                      {date ? "Aucune commande ce jour-là." : "Cliquez sur une barre du graphique."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-violet-50/40 transition-colors duration-150">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(order.user?.name)}`}>
                        {getInitials(order.user?.name)}
                      </div>
                      <span className="font-medium text-slate-900">{order.user?.name ?? "Invité"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      {order.items_count} article(s)
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${STATUS_STYLES[order.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[var(--color-secondary)] tabular-nums">
                    {order.total_price.toLocaleString()} MAD
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 text-right">
                    {new Date(order.created_at).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}