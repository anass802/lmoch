import { Trophy, Crown } from "lucide-react";

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-700", "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700", "bg-fuchsia-100 text-fuchsia-700",
];
function getInitials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : (parts[0]?.slice(0, 2).toUpperCase() ?? "?");
}
function avatarColor(name?: string) {
  return name ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] : AVATAR_COLORS[0];
}

type TopCustomer = { id: number; name: string; total_spent: string | number; orders_count: number };

const RANK_STYLES = [
  { ring: "ring-2 sm:ring-4 ring-yellow-400/70", badge: "bg-yellow-400 text-yellow-900", lift: "sm:-translate-y-3", size: "w-14 h-14 sm:w-18 sm:h-18 text-base sm:text-lg" },
  { ring: "ring-2 sm:ring-4 ring-gray-300/70", badge: "bg-gray-300 text-gray-700", lift: "sm:translate-y-1", size: "w-12 h-12 sm:w-15 sm:h-15 text-sm sm:text-base" },
  { ring: "ring-2 sm:ring-4 ring-orange-300/70", badge: "bg-orange-300 text-orange-900", lift: "sm:translate-y-3", size: "w-12 h-12 sm:w-15 sm:h-15 text-sm sm:text-base" },
];

export default function TopCustomersBanner({ customers }: { customers: TopCustomer[] }) {
  if (!customers.length) return null;

  const ordered =
    customers.length === 3 ? [customers[1], customers[0], customers[2]] : customers;
  const styleFor = (c: TopCustomer) => RANK_STYLES[customers.indexOf(c)];

  return (
    <section className="bg-gradient-to-b from-[#0B1E3D] to-[#132a52] py-6 sm:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center mb-5 sm:mb-6">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
            <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400" />
            <span className="text-[10px] sm:text-[11px] tracking-wide text-orange-200 uppercase font-medium">
              Classement du mois
            </span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white">Nos meilleurs clients</h2>
        </div>

        <div className="flex justify-center items-end gap-3 sm:gap-6 flex-wrap">
          {ordered.map((c) => {
            const style = styleFor(c);
            const rank = customers.indexOf(c);
            return (
              <div
                key={c.id}
                className={`flex flex-col items-center text-center transition-transform ${style.lift}`}
              >
                <div className="relative mb-2">
                  {rank === 0 && (
                    <Crown
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2"
                      fill="currentColor"
                    />
                  )}
                  <div
                    className={`${style.size} rounded-full flex items-center justify-center font-bold ${avatarColor(c.name)} ${style.ring} ring-offset-2 sm:ring-offset-4 ring-offset-[#0B1E3D]`}
                  >
                    {getInitials(c.name)}
                  </div>
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${style.badge} border-2 border-[#0B1E3D]`}
                  >
                    {rank + 1}
                  </span>
                </div>

                <p className="mt-1.5 font-semibold text-white text-xs sm:text-sm">{c.name}</p>
                <p className="text-[9px] sm:text-[10px] text-orange-300 mt-0.5 tracking-wide">Félicitations</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}