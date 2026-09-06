import { useEffect, useState, useCallback } from "react";
import { getRevenueByDay, getStockSummary, getLowStockProducts, getOrdersByDay } from "../api/Adminservice";
import type { RevenueByDay, StockSummary, LowStockProduct, DailyOrder } from "../types/admin";
import { TrendingUp, ShoppingBag, Package, AlertTriangle } from "lucide-react";
import RevenueChart from "../components/Dashboard/RevenueChart";
import StockHealthCard from "../components/Dashboard/StockHealthCard";
import DailyOrdersTable from "../components/Dashboard/DailyOrdersTable";

const PRIMARY = "#EA580C";   // orange-600, matches Lmoch.com logo
const SECONDARY = "#FDBA74"; // orange-300

type StatMiniCardProps = { label: string; text: string; value: string | number; icon: React.ElementType };

function StatMiniCard({ label, text, value, icon: Icon }: StatMiniCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <span className="text-sm font-semibold">{label}</span>
      <p className="text-4xl font-semibold text-orange-600 tabular-nums">{value}</p>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-orange-600" />
        <p className="text-xs font-semibold text-orange-600">{text}</p>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 bg-slate-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-slate-200 rounded-3xl" />
        <div className="h-80 bg-slate-200 rounded-3xl" />
      </div>
      <div className="h-64 bg-slate-200 rounded-3xl" />
    </div>
  );
}

const RANGE_OPTIONS = [7, 30, 90];

export default function RevenueStockDashboard() {
  const [range, setRange] = useState(30);
  const [revenue, setRevenue] = useState<RevenueByDay[]>([]);
  const [stockSummary, setStockSummary] = useState<StockSummary | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dailyOrders, setDailyOrders] = useState<DailyOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const [revRes, stockRes, lowRes] = await Promise.all([
        getRevenueByDay(range),
        getStockSummary(),
        getLowStockProducts(10),
      ]);
      setRevenue(revRes.data.data);
      setStockSummary(stockRes.data.data);
      setLowStock(lowRes.data.data);

      const lastActive = [...revRes.data.data].reverse().find((d) => d.orders_count > 0);
      setSelectedDate((prev) => prev ?? lastActive?.date ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!selectedDate) return;
    setOrdersLoading(true);
    getOrdersByDay(selectedDate, 10)
      .then((res) => setDailyOrders(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setOrdersLoading(false));
  }, [selectedDate]);

  if (loading) return <PageSkeleton />;

  const totalRevenue = revenue.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = revenue.reduce((s, d) => s + d.orders_count, 0);
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="space-y-8 p-1 text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Stock &amp; Revenus</h1>
          <p className="text-sm text-slate-500 mt-1">Analysez vos revenus, votre stock et vos commandes par jour.</p>
        </div>
        <div className="inline-flex items-center bg-white border border-slate-200 rounded-full p-1">
          {RANGE_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                range === r ? "bg-orange-600 text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {r}j
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatMiniCard label="Revenus" text={`Sur ${range} jours`} value={`${totalRevenue.toLocaleString()} MAD`} icon={TrendingUp} />
        <StatMiniCard label="Commandes" text={`Sur ${range} jours`} value={totalOrders} icon={ShoppingBag} />
        <StatMiniCard label="Panier moyen" text="Par commande" value={`${avgOrder.toLocaleString()} MAD`} icon={Package} />
        <StatMiniCard label="Stock faible" text="Produits à réapprovisionner" value={stockSummary?.low_stock ?? 0} icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={revenue} selectedDate={selectedDate} onSelectDate={setSelectedDate} primaryColor={PRIMARY} secondaryColor={SECONDARY} />
        <StockHealthCard summary={stockSummary} lowStockProducts={lowStock} primaryColor={PRIMARY} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DailyOrdersTable date={selectedDate} orders={dailyOrders} loading={ordersLoading} />
      </div>
    </div>
  );
}