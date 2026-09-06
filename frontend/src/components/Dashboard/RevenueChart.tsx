import { useMemo } from "react";
import {
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { RevenueByDay } from "../../types/admin";

type Props = {
  data: RevenueByDay[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  primaryColor: string;
  secondaryColor: string;
};

export default function RevenueChart({ data, selectedDate, onSelectDate, primaryColor, secondaryColor }: Props) {
  const totalRevenue = useMemo(() => data.reduce((s, d) => s + d.revenue, 0), [data]);

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Revenus par jour</h2>
            <p className="text-xs text-slate-400">Cliquez sur une barre pour voir les commandes de ce jour</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-[var(--color-primary)] tabular-nums">
          {totalRevenue.toLocaleString()} MAD
        </p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => new Date(d).toLocaleDateString("fr-MA", { day: "2-digit", month: "2-digit" })}
            stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }}
            formatter={(value: any) => [`${Number(value).toLocaleString()} MAD`, "Revenu"]}
            labelFormatter={(label) =>
                new Date(label as string).toLocaleDateString("fr-MA", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                })
            }
          />
          <Bar
            dataKey="revenue"
            radius={[8, 8, 8, 8]}
            maxBarSize={26}
            onClick={(entry: any) => onSelectDate(entry.date)}
            cursor="pointer"
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.date === selectedDate ? primaryColor : secondaryColor}
                opacity={entry.date === selectedDate ? 1 : 0.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}