import { Heart, MapPin } from "lucide-react";
import type { CatListing } from "../../types/Cats";
import { Link } from "react-router-dom";

export default function CatCard({ cat }: { cat: CatListing }) {
  const url = import.meta.env.VITE_API_URL;

  return (
    <Link
      to={`/cats/${cat.id}`}
      className="border border-[#EFE7D8] rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-[#FAF7F1] relative">
        <img
          src={cat.image ? `${url}/storage/${cat.image}` : "/placeholder-cat.png"}
          alt={cat.name}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white ${
            cat.listing_type === "adoption" ? "bg-[#E07A3F]" : "bg-[#1E3A6E]"
          }`}
        >
          {cat.listing_type === "adoption" ? (
            <span className="flex items-center gap-1"><Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Adoption</span>
          ) : (
            "Vente"
          )}
        </span>
      </div>
      <div className="p-2.5 sm:p-4 space-y-0.5 sm:space-y-1">
        <p className="font-semibold text-sm sm:text-base text-[#1E3A6E] truncate">{cat.name}</p>
        <p className="text-[11px] sm:text-xs text-gray-500">
          {cat.breed ?? "Race inconnue"} · {cat.gender === "male" ? "Mâle" : "Femelle"}
          {cat.age_months != null ? ` · ${cat.age_months} mois` : ""}
        </p>
        {cat.city && (
          <p className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-400">
            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {cat.city}
          </p>
        )}
        {cat.listing_type === "vente" && cat.price != null && (
          <p className="text-[#FF7A45] text-sm sm:text-base font-bold pt-1">{cat.price} Dhs</p>
        )}
      </div>
    </Link>
  );
}