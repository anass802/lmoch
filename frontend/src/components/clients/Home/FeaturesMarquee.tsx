// components/clients/Home/FeaturesMarquee.tsx
import { Package, ShieldCheck, Headphones, Truck } from "lucide-react";

const features = [
  { icon: Package, title: "Click & Collect", desc: "Commandez en ligne, récupérez en magasin" },
  { icon: ShieldCheck, title: "Paiement à la livraison", desc: "Payez en toute tranquillité" },
  { icon: Headphones, title: "Service client", desc: "Toujours là pour vous répondre" },
  { icon: Truck, title: "Livraison à domicile", desc: "Rapide et sécurisée, partout au Maroc" },
];

export default function FeaturesMarquee() {
  const looped = [...features, ...features];

  return (
    <div className="w-full flex flex-col gap-4 overflow-hidden bg-[#F2F4F7] py-4 sm:py-6 mt-8 sm:mt-14 marquee-group">
      <div className="flex gap-8 sm:gap-16 w-max animate-marquee">
        {looped.map((f, i) => (
          <div key={i} className="flex items-center gap-2.5 sm:gap-3 shrink-0 px-3 sm:px-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
              <f.icon size={16} className="sm:hidden text-[#798088]" />
              <f.icon size={20} className="hidden sm:block text-[#798088]" />
            </div>
            <div>
              <p className="font-semibold text-xs sm:text-base text-[#16213E] whitespace-nowrap">
                {f.title}
              </p>
              <p className="hidden sm:block text-sm text-[#6B7280] whitespace-nowrap">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}