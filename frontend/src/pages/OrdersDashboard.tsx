import { useEffect, useState, useCallback } from "react";
import { getOrders } from "../api/Adminservice";
import type { OrderDetail, OrderStatus, OrdersMeta } from "../types/admin";
import OrdersFilters, {type DatePreset } from "../components/Dashboard/Orders/OrdersFilters";
import OrdersTable from "../components/Dashboard/Orders/OrdersTable";

function presetToRange(preset: DatePreset): { date_from?: string; date_to?: string } {
  const today = new Date();
  const toISO = (d: Date) => d.toISOString().split("T")[0];

  if (preset === "today") return { date_from: toISO(today), date_to: toISO(today) };
  if (preset === "48h") {
    const from = new Date(today);
    from.setDate(from.getDate() - 2);
    return { date_from: toISO(from) };
  }
  return {};
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [meta, setMeta] = useState<OrdersMeta | null>(null);
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [datePreset, setDatePreset] = useState<DatePreset>("48h");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const range = presetToRange(datePreset);
      const res = await getOrders({ status, ...range, page, per_page: 20 });
      setOrders(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [status, datePreset, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [status, datePreset]);

  const handleStatusChanged = (orderId: number, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Commandes</h1>
          <p className="text-sm text-gray-400 mt-0.5">{meta?.total ?? 0} commande(s)</p>
        </div>
        <OrdersFilters status={status} onStatusChange={setStatus} datePreset={datePreset} onDatePresetChange={setDatePreset} />
      </div>

      <OrdersTable orders={orders} loading={loading} onStatusChanged={handleStatusChanged} />

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 disabled:opacity-40"
          >
            Précédent
          </button>
          <span className="text-xs text-gray-500">Page {meta.current_page} / {meta.last_page}</span>
          <button
            disabled={page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}