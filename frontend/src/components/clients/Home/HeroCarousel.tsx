// components/clients/Home/HeroCarousel.tsx
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getActiveEvent } from "../../../api/ClientServices";
import slide1 from '../../../assets/images/slides/28584a91-e754-4dc8-b67c-5d62bb4012aa.png'
import slide2 from '../../../assets/images/slides/63db903f-7dcd-4007-9dd3-fc14b6651633.png'
import slide3 from '../../../assets/images/slides/85c93571-0793-462a-9bf0-99c6bf3bf42e.png'
import slide4 from '../../../assets/images/slides/ChatGPT Image Sep 6, 2026, 05_25_51 PM.png'
import slide5 from '../../../assets/images/slides/Unknown.jpg'
import slide6 from '../../../assets/images/slides/aaf507dc-8530-4397-93f1-1d5c1cc69cf5.png'

type Slide = { id: number; image: string };

const defaultSlides: Slide[] = [
  { id: 1, image: slide1 },
  { id: 2, image: slide2 },
  { id: 3, image: slide3 },
  { id: 4, image: slide4 },
  { id: 5, image: slide5 },
  { id: 6, image: slide6 },
];

const eventImageModules = import.meta.glob(
  "../../../assets/images/events/*/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" }
) as Record<string, string>;

function getEventSlides(eventKey: string): Slide[] {
  return Object.entries(eventImageModules)
    .filter(([path]) => path.includes(`/events/${eventKey}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, image], i) => ({ id: i, image }));
}

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [activeEventKey, setActiveEventKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    const fetchActiveEvent = async () => {
      try {
        const res = await getActiveEvent();
        setActiveEventKey(res.data.data?.key ?? null);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'événement actif :", error);
      }
    };
    fetchActiveEvent();
  }, []);

  const slides = activeEventKey ? getEventSlides(activeEventKey) : defaultSlides;
  const finalSlides = slides.length ? slides : defaultSlides;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % finalSlides.length);
    }, 4000);
    return () => resetTimeout();
  }, [current, finalSlides.length]);

  useEffect(() => {
    setCurrent(0);
  }, [activeEventKey]);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c - 1 + finalSlides.length) % finalSlides.length);
  const next = () => setCurrent((c) => (c + 1) % finalSlides.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    resetTimeout();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      if (touchDeltaX.current < 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <section className="mt-4 sm:mt-6">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black w-full aspect-[1916/821]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {finalSlides.map((slide) => (
              <div key={slide.id} className="w-full h-full flex-shrink-0">
                <img
                  src={slide.image}
                  alt=""
                  draggable={false}
                  className="w-full h-full object-cover select-none"
                />
              </div>
            ))}
          </div>

          {/* arrows — hidden on mobile, swipe handles it there */}
          <button
            onClick={prev}
            className="hidden sm:flex absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 items-center justify-center text-white transition-colors"
            aria-label="Précédent"
          >
            <ChevronLeft size={18} className="sm:hidden" />
            <ChevronLeft size={20} className="hidden sm:block" />
          </button>
          <button
            onClick={next}
            className="hidden sm:flex absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 items-center justify-center text-white transition-colors"
            aria-label="Suivant"
          >
            <ChevronRight size={18} className="sm:hidden" />
            <ChevronRight size={20} className="hidden sm:block" />
          </button>

          {/* dots */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 flex gap-1.5 sm:gap-2">
            {finalSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Aller à la diapositive ${i + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  i === current ? "w-5 sm:w-6 bg-[#FF7A45]" : "w-1.5 sm:w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}