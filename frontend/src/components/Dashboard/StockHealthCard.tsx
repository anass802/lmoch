import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Package, AlertTriangle } from "lucide-react";
import type { StockSummary, LowStockProduct } from "../../types/admin";

type Props = {
  summary: StockSummary | null;
  lowStockProducts: LowStockProduct[];
  primaryColor: string;
};

export default function StockHealthCard({ summary, lowStockProducts, primaryColor }: Props) {
  const total = summary?.total_products ?? 0;
  const inStock = summary?.in_stock ?? 0;
  const lowStock = summary?.low_stock ?? 0;
  const outOfStock = summary?.out_of_stock ?? 0;
  const healthyPct = total > 0 ? Math.round((inStock / total) * 100) : 100;

  const gaugeData = [
    { name: "En stock", value: inStock || 0.0001 },
    { name: "Stock faible", value: lowStock || 0.0001 },
    { name: "Rupture", value: outOfStock || 0.0001 },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
      <div className="mb-2 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
          <Package className="w-4 h-4 text-[var(--color-primary)]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Santé du stock</h2>
          <p className="text-xs text-slate-400">{total} produits au total</p>
        </div>
      </div>

      <div className="relative flex items-center justify-center h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData} dataKey="value" startAngle={180} endAngle={0}
              cx="50%" cy="90%" innerRadius={65} outerRadius={90} cornerRadius={16} paddingAngle={3}
            >
              <Cell fill={primaryColor} />
              <Cell fill="#F59E0B" />
              <Cell fill="#EF4444" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 flex flex-col items-center">
          <span className="text-2xl font-black text-slate-900 tabular-nums">{healthyPct}%</span>
          <span className="text-xs text-slate-400">En stock</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          Produits à surveiller
        </p>
        {lowStockProducts.length === 0 ? (
          <p className="text-xs text-slate-400">Aucun produit en stock faible.</p>
        ) : (
          lowStockProducts.slice(0, 5).map((p) => (
            <div key={p.product_id} className="flex items-center justify-between text-xs">
              <span className="text-slate-700 truncate">{p.name}</span>
              <span className={`font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                p.stock <= 0 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
              }`}>
                {p.stock} unité{p.stock > 1 ? "s" : ""}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}