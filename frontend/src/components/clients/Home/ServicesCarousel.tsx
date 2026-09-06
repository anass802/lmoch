import { useState, useEffect } from "react";
import logo from "../../../assets/images/logo/lmoch.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PlayfulCat from "./WalkingCat";

const slides = [
  {
    id: 1,
    eyebrow: "Nouvelle collection",
    title: "Tout pour le",
    highlight: "bonheur",
    titleEnd: "de votre compagnon",
    text: "Croquettes, jouets et accessoires premium sélectionnés avec soin, livrés partout au Maroc.",
    from: "#152C56",
    to: "#1E3A6E",
  },
  {
    id: 2,
    eyebrow: "Offre limitée",
    title: "Jusqu'à",
    highlight: "-30%",
    titleEnd: "sur les croquettes premium",
    text: "Profitez de nos meilleures marques à prix réduit, pendant une durée limitée.",
    from: "#D9931F",
    to: "#FAAC2C",
  },
  {
    id: 3,
    eyebrow: "Livraison rapide",
    title: "Livré chez vous en",
    highlight: "24h",
    titleEnd: "sur Casablanca",
    text: "Commandez en ligne et recevez vos produits rapidement, où que vous soyez.",
    from: "#D9622C",
    to: "#FF7A45",
  },
];

export default function ServicesCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearTimeout(t);
  }, [current]);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <>
      <PlayfulCat />
      <section className="relative max-w-[1280px] mx-auto overflow-hidden rounded-2xl sm:rounded-3xl mt-8 sm:mt-15 shadow-xl">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              style={{ background: `linear-gradient(135deg, ${slide.from}, ${slide.to})` }}
              className="relative w-full min-h-[380px] sm:h-[440px] flex-shrink-0 px-5 py-10 sm:px-8 sm:py-16 md:px-16 md:py-0 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 sm:gap-10"
            >
              {/* subtle texture */}
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* soft vignette for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/5 pointer-events-none" />

              {/* copy */}
              <div className="relative z-10 max-w-lg text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3 sm:mb-4">
                  <span className="w-6 h-px bg-white/40" />
                  <span className="text-white/80 text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase">
                    {slide.eyebrow}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-white leading-[1.15] mb-3 sm:mb-4 tracking-tight">
                  {slide.title}{" "}
                  <span className="text-[#FFE8D2]">{slide.highlight}</span>{" "}
                  {slide.titleEnd}
                </h1>

                <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-md mx-auto md:mx-0">
                  {slide.text}
                </p>
              </div>

              {/* logo */}
              <div className="hidden sm:flex relative z-10 flex-shrink-0 items-center justify-center">
                <div className="absolute w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full bg-white/5" />
                <img
                  src={logo}
                  alt="lmoch"
                  className="relative w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52 object-contain drop-shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* arrows */}
        <button
          onClick={prev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white transition-colors z-20"
          aria-label="Précédent"
        >
          <ChevronLeft size={16} className="sm:hidden" />
          <ChevronLeft size={18} className="hidden sm:block" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white transition-colors z-20"
          aria-label="Suivant"
        >
          <ChevronRight size={16} className="sm:hidden" />
          <ChevronRight size={18} className="hidden sm:block" />
        </button>

        {/* dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 flex gap-1.5 sm:gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Aller à la diapositive ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-5 sm:w-6 bg-white" : "w-1.5 bg-white/35"
              }`}
            />
          ))}
        </div>
      </section>
    </>
  );
}