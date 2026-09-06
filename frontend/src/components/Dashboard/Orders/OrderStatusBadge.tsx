import { useState } from "react";
import type { OrderStatus } from "../../../types/admin";
import { updateOrderStatus } from "../../../api/Adminservice";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  shipped: "bg-blue-50 text-blue-600 border-blue-200",
  delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
  paid: "bg-orange-50 text-orange-600 border-orange-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  shipped: "Expédiée",
  delivered: "Livrée",
  paid: "Payée",
  cancelled: "Annulée",
};

const ALL_STATUSES: OrderStatus[] = ["pending", "shipped", "delivered", "paid", "cancelled"];

type Props = { orderId: number; status: OrderStatus; onChanged: (status: OrderStatus) => void };

export default function OrderStatusBadge({ orderId, status, onChanged }: Props) {
  const [saving, setSaving] = useState(false);

  const handleChange = async (next: OrderStatus) => {
    if (next === status) return;
    setSaving(true);
    try {
      await updateOrderStatus(orderId, next);
      onChanged(next);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer disabled:opacity-50 ${STATUS_STYLES[status]}`}
    >
      {ALL_STATUSES.map((s) => (
        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
      ))}
    </select>
  );
}