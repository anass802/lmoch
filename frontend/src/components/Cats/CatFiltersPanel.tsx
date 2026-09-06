import { useEffect, useState } from "react";
import { getCatBreeds } from "../../api/CatServices";
import type { CatFilters, ListingType } from "../../types/Cats";

type Props = {
  filters: CatFilters;
  onChange: (filters: CatFilters) => void;
  listingType: ListingType;
};

export default function CatFiltersPanel({ filters, onChange, listingType }: Props) {
  const [breeds, setBreeds] = useState<string[]>([]);

  useEffect(() => {
    getCatBreeds(listingType)
      .then((res) => setBreeds(res.data.data))
      .catch((err) => console.error(err));
  }, [listingType]);

  const set = <K extends keyof CatFilters>(key: K, value: CatFilters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="bg-white border border-[#EFE7D8] rounded-2xl p-4 sm:p-5 space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Race</label>
        <select
          value={filters.breed}
          onChange={(e) => set("breed", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
        >
          <option value="">Toutes</option>
          {breeds.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Sexe</label>
        <div className="flex gap-2">
          {(["", "male", "female"] as const).map((g) => (
            <button
              key={g}
              onClick={() => set("gender", g)}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-medium border ${
                filters.gender === g ? "bg-[#1E3A6E] text-white border-[#1E3A6E]" : "border-gray-200 text-gray-600"
              }`}
            >
              {g === "" ? "Tous" : g === "male" ? "Mâle" : "Femelle"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Âge min (mois)</label>
          <input
            type="number" min="0"
            value={filters.min_age}
            onChange={(e) => set("min_age", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Âge max (mois)</label>
          <input
            type="number" min="0"
            value={filters.max_age}
            onChange={(e) => set("max_age", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-sm"
          />
        </div>
      </div>

      {listingType === "vente" && (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Prix min</label>
            <input
              type="number" min="0"
              value={filters.min_price}
              onChange={(e) => set("min_price", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Prix max</label>
            <input
              type="number" min="0"
              value={filters.max_price}
              onChange={(e) => set("max_price", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-sm"
            />
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Ville</label>
        <input
          value={filters.city}
          onChange={(e) => set("city", e.target.value)}
          placeholder="Casablanca..."
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.vaccinated}
            onChange={(e) => set("vaccinated", e.target.checked)}
            className="accent-orange-600 w-4 h-4"
          />
          Vacciné
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.sterilized}
            onChange={(e) => set("sterilized", e.target.checked)}
            className="accent-orange-600 w-4 h-4"
          />
          Stérilisé
        </label>
      </div>
    </div>
  );
}