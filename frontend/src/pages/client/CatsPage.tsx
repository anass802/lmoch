import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { getCatListings } from "../../api/CatServices";
import { emptyFilters, type CatFilters, type CatListing, type ListingType } from "../../types/Cats";
import CatTypeToggle from "../../components/Cats/CatTypeToggle";
import CatFiltersPanel from "../../components/Cats/CatFiltersPanel";
import CatCard from "../../components/Cats/CatCard";

export default function CatsPage() {
  const [listingType, setListingType] = useState<ListingType | null>(null);
  const [filters, setFilters] = useState<CatFilters>(emptyFilters);
  const [cats, setCats] = useState<CatListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const load = (page = 1) => {
    if (!listingType) return;
    setLoading(true);
    getCatListings({ ...filters, listing_type: listingType }, page)
      .then((res) => {
        setCats(res.data.data.data);
        setPagination({
          current_page: res.data.data.current_page,
          last_page: res.data.data.last_page,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingType, filters]);

  const handleTypeChange = (type: ListingType) => {
    setListingType(type);
    setFilters({ ...emptyFilters, listing_type: type });
  };

  return (
    <div className="max-w-[1480px] mx-auto px-4 py-6 sm:py-10 space-y-6 sm:space-y-8">
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-xl sm:text-3xl font-bold text-[#1E3A6E]">Chats à vendre & à adopter</h1>
        <CatTypeToggle value={listingType} onChange={handleTypeChange} />
      </div>

      {!listingType ? (
        <p className="text-center text-gray-400 text-sm px-4">
          Choisissez « À vendre » ou « À adopter » pour voir les chats disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-8 items-start">
          {/* mobile filter toggle button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 w-full border border-[#EFE7D8] rounded-xl py-2.5 text-sm font-medium text-[#1E3A6E] bg-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>

          {/* desktop filters — always visible */}
          <div className="hidden md:block md:col-span-1">
            <CatFiltersPanel filters={filters} onChange={setFilters} listingType={listingType} />
          </div>

          {/* mobile filters — slide-up sheet */}
          <div
            className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
              mobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <div
              className={`absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-[#FAF7F1] rounded-t-3xl transition-transform duration-300 ease-out ${
                mobileFiltersOpen ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#EFE7D8] sticky top-0 bg-[#FAF7F1]">
                <p className="font-semibold text-[#1E3A6E]">Filtres</p>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Fermer">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4">
                <CatFiltersPanel filters={filters} onChange={setFilters} listingType={listingType} />
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full mt-4 bg-[#1E3A6E] text-white rounded-xl py-3 font-bold text-sm"
                >
                  Voir les résultats
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-5 sm:space-y-6">
            {loading ? (
              <p className="text-sm text-gray-400">Chargement...</p>
            ) : cats.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun chat trouvé pour ces critères.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {cats.map((cat) => (
                  <CatCard key={cat.id} cat={cat} />
                ))}
              </div>
            )}

            {pagination.last_page > 1 && (
              <div className="flex items-center gap-2 flex-wrap">
                {Array.from({ length: pagination.last_page }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => load(page)}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm ${
                        page === pagination.current_page
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-orange-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}