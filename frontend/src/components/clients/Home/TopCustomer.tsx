import { Trophy, Crown, Sparkles } from "lucide-react";

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-fuchsia-100 text-fuchsia-700",
];

function getInitials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0]?.slice(0, 2).toUpperCase() ?? "?");
}

function avatarColor(name: string) {
  return name ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] : AVATAR_COLORS[0];
}

function isWithinDisplayWindow() {
  const day = new Date().getDate();
  return day >= 1 && day <= 3;
}

export default function TopCustomersBanner({ customers }: { customers: any[] }) {
  if (!customers?.length) return null;
  if (!isWithinDisplayWindow()) return null;

  const c = customers[0];

  return (
    <section className="bg-gradient-to-r from-[#0B1E3D] to-[#132a52] py-3 sm:py-4">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 sm:gap-6 bg-white/[0.04] border border-white/10 rounded-2xl px-4 sm:px-6 py-3 sm:py-4">

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative shrink-0">
              <Crown
                className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 absolute -top-3 sm:-top-3.5 left-1/2 -translate-x-1/2"
                fill="currentColor"
              />
              <div
                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${avatarColor(c.name)} ring-2 sm:ring-[3px] ring-yellow-400/70 ring-offset-2 ring-offset-[#0B1E3D]`}
              >
                {getInitials(c.name)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-yellow-400 text-yellow-900 border-2 border-[#0B1E3D]">
                1
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] tracking-wide text-orange-200 uppercase font-medium">
                Client du mois
              </span>
              <p className="font-semibold text-white text-sm sm:text-base leading-tight">
                {c.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
            <div className="flex flex-col items-end">
              <span className="text-white font-bold text-xs sm:text-sm">Félicitations !</span>
              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-orange-300">
                <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
                Meilleur client
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}