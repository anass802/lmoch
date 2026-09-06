import { useEffect, useState } from "react";
import { getAdminEvents, activateEvent, deactivateAllEvents } from "../../../api/Adminservice";
import { Cake, Tag, Moon, Ghost, PartyPopper, Star, Check } from "lucide-react";

type EventItem = { id: number; key: string; name: string; is_active: boolean };

const EVENT_ICONS: Record<string, typeof Cake> = {
  birthDay: Cake,
  blackFriday: Tag,
  eidAdha: Moon,
  halowin: Ghost,
  newYear: PartyPopper,
  ramadan: Star,
};

const EVENT_THEME: Record<string, { bg: string; text: string; ring: string }> = {
  birthDay:    { bg: "bg-pink-50",   text: "text-pink-600",   ring: "ring-pink-400" },
  blackFriday: { bg: "bg-gray-900/5", text: "text-gray-800",  ring: "ring-gray-800" },
  eidAdha:     { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-400" },
  halowin:     { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-400" },
  newYear:     { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-400" },
  ramadan:     { bg: "bg-amber-50",  text: "text-amber-600",  ring: "ring-amber-400" },
};

export default function EventsAdmin() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const load = async () => {
    const res = await getAdminEvents();
    setEvents(res.data.data);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (e: EventItem) => {
    setLoadingId(e.id);
    try {
      if (e.is_active) {
        await deactivateAllEvents();
      } else {
        await activateEvent(e.id);
      }
      await load();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Événements saisonniers</h2>
        <p className="text-sm text-gray-400">Un seul événement peut être actif à la fois sur le site.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((e) => {
          const Icon = EVENT_ICONS[e.key] ?? Star;
          const theme = EVENT_THEME[e.key] ?? EVENT_THEME.ramadan;
          const isLoading = loadingId === e.id;

          return (
            <div
              key={e.id}
              className={`relative rounded-2xl border p-5 transition-all ${
                e.is_active
                  ? `border-transparent ring-2 ${theme.ring} shadow-md bg-white`
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              {e.is_active && (
                <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
                  <Check className="w-3 h-3" /> Actif
                </span>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.bg} ${theme.text} mb-4`}>
                <Icon className="w-6 h-6" />
              </div>

              <p className="font-semibold text-gray-800 mb-4">{e.name}</p>

              <button
                onClick={() => toggle(e)}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                  e.is_active
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isLoading ? "..." : e.is_active ? "Désactiver" : "Activer"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}