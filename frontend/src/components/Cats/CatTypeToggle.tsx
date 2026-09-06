import { Heart, ShoppingBag } from "lucide-react";
import type { ListingType } from "../../types/Cats";

type Props = {
  value: ListingType | null;
  onChange: (type: ListingType) => void;
};

export default function CatTypeToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 justify-center flex-wrap">
      <button
        onClick={() => onChange("vente")}
        className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-colors ${
          value === "vente"
            ? "bg-[#1E3A6E] text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        À vendre
      </button>
      <button
        onClick={() => onChange("adoption")}
        className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-colors ${
          value === "adoption"
            ? "bg-[#E07A3F] text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        À adopter
      </button>
    </div>
  );
}