import type { OrderStatus } from "../../../types/admin";

const STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "paid", label: "Payée" },
  { value: "cancelled", label: "Annulée" },
];

export type DatePreset = "48h" | "today" | "all";

type Props = {
  status: OrderStatus | "all";
  onStatusChange: (s: OrderStatus | "all") => void;
  datePreset: DatePreset;
  onDatePresetChange: (p: DatePreset) => void;
};

export default function OrdersFilters({ status, onStatusChange, datePreset, onDatePresetChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as OrderStatus | "all")}
        className="text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
      >
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1">
        {([
          { value: "48h", label: "Dernières 48h" },
          { value: "today", label: "Aujourd'hui" },
          { value: "all", label: "Tout" },
        ] as { value: DatePreset; label: string }[]).map((opt) => (
          <button
            key={opt.value}
            onClick={() => onDatePresetChange(opt.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              datePreset === opt.value ? "bg-orange-600 text-white" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}