import { useState, useEffect } from "react";
import { X } from "lucide-react";
import logo from "../../assets/images/logo/lmoch.png";

const SOCIALS = [
  {
    name: "WhatsApp",
    href: "https://wa.me/212612911675",
    bg: "bg-[#25D366]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-white">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.34c1.36.72 2.9 1.13 4.62 1.13h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.42 17.5 2 12.04 2Zm5.79 14.12c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.1.11-1.78-.11-.41-.13-.93-.3-1.6-.59-2.82-1.22-4.66-4.05-4.8-4.24-.14-.19-1.15-1.53-1.15-2.92 0-1.39.72-2.07.98-2.35.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/lmochstore/",
    bg: "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-white">
        <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.61.24 1.05.52 1.51.98.46.46.74.9.98 1.51.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43-.24.61-.52 1.05-.98 1.51-.46.46-.9.74-1.51.98-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.1 4.1 0 0 1-1.51-.98 4.1 4.1 0 0 1-.98-1.51c-.16-.46-.35-1.26-.4-2.43-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.24-.61.52-1.05.98-1.51.46-.46.9-.74 1.51-.98.46-.16 1.26-.35 2.43-.4C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5.01-4.73.07-.96.04-1.48.2-1.82.34-.46.18-.78.39-1.13.73-.34.35-.55.67-.73 1.13-.14.34-.3.86-.34 1.82C3.19 8.5 3.18 8.85 3.18 12s.01 3.5.07 4.73c.04.96.2 1.48.34 1.82.18.46.39.78.73 1.13.35.34.67.55 1.13.73.34.14.86.3 1.82.34 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.96-.04 1.48-.2 1.82-.34.46-.18.78-.39 1.13-.73.34-.35.55-.67.73-1.13.14-.34.3-.86.34-1.82.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.96-.2-1.48-.34-1.82a3 3 0 0 0-.73-1.13 3 3 0 0 0-1.13-.73c-.34-.14-.86-.3-1.82-.34C15.5 4.01 15.15 4 12 4Zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9Zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Zm5.15-1.98a1.16 1.16 0 1 1-2.31 0 1.16 1.16 0 0 1 2.31 0Z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@lmochoff",
    bg: "bg-black",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-white">
        <path d="M16.6 5.82c-.9-.6-1.55-1.5-1.77-2.55-.05-.24-.08-.49-.08-.75h-3.03v13.66c0 1.5-1.22 2.71-2.71 2.71a2.71 2.71 0 0 1-2.71-2.71 2.71 2.71 0 0 1 2.71-2.71c.28 0 .55.04.8.12v-3.08a5.75 5.75 0 0 0-.8-.06 5.74 5.74 0 0 0-5.74 5.74A5.74 5.74 0 0 0 9.01 22a5.74 5.74 0 0 0 5.74-5.74V9.02a7.4 7.4 0 0 0 4.32 1.38V7.37c-.9 0-1.75-.27-2.47-.75Z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://web.facebook.com/profile.php?id=100079650670864",
    bg: "bg-[#1877F2]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-white">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
      </svg>
    ),
  },
];

export default function SocialFloatingButton() {
  const [open, setOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  // Periodically toggle the "Allo Lmoch" label on mobile — appears for a few
  // seconds, hides for a while, then reappears, as a subtle attention pulse.
  useEffect(() => {
    if (open) return; // don't animate the label while the panel is open
    const showFor = 4000;
    const hideFor = 6000;
    let timeout: ReturnType<typeof setTimeout>;

    const cycle = (visible: boolean) => {
      setShowLabel(visible);
      timeout = setTimeout(() => cycle(!visible), visible ? showFor : hideFor);
    };
    cycle(true);

    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <>
      {/* Click-outside catcher */}
      {open && (
        <div
          className="fixed inset-0 z-[55]"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col items-end gap-2.5 sm:gap-3">
        {/* Expanded social icons */}
        <div
          className={`flex flex-col items-end gap-2.5 sm:gap-3 transition-all duration-300 ${
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          {SOCIALS.map((s, i) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              className={`group flex items-center gap-2 sm:gap-3 transition-all duration-300 ${
                open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              }`}
            >
              <span className="bg-white text-[#1E3A6E] text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {s.name}
              </span>
              <span
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg active:scale-95 sm:hover:scale-110 transition-transform ${s.bg}`}
              >
                {s.icon}
              </span>
            </a>
          ))}
        </div>

        {/* Main launcher */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 sm:gap-2 pl-3 sm:pl-4 pr-1.5 py-1.5 rounded-full bg-[#1E3A6E] shadow-xl active:shadow-2xl sm:hover:shadow-2xl transition-shadow"
        >
          {!open && (
            <>
              {/* mobile — fades in/out on a timer */}
              <span
                className={`sm:hidden text-white text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-500 ${
                  showLabel ? "max-w-[120px] opacity-100 ml-0" : "max-w-0 opacity-0 -ml-1"
                }`}
              >
                Allo Lmoch
              </span>
              {/* desktop — always visible, unchanged */}
              <span className="hidden sm:inline text-white text-sm font-semibold whitespace-nowrap">
                Allo Lmoch
              </span>
            </>
          )}
          <span className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden ring-2 ring-white/20 flex-shrink-0">
            <img src={logo} alt="Lmoch.com" className="w-full h-full object-cover" />
            {!open && (
              <span className="absolute inset-0 rounded-full ring-2 ring-[#FF7A45] animate-ping" />
            )}
          </span>
          {open && (
            <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </span>
          )}
        </button>
      </div>
    </>
  );
}