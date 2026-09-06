import { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import type { CatListing } from "../../types/Cats";
import { createCatListing, updateCatListing } from "../../api/Adminservice";

const BASE_URL = import.meta.env.VITE_API_URL;

type Props = {
  cat: CatListing | null | undefined; // null = create, object = edit
  onClose: () => void;
  onSaved: () => void;
};

export default function CatListingModal({ cat, onClose, onSaved }: Props) {
  const isEdit = !!cat;

  const [name, setName] = useState(cat?.name ?? "");
  const [breed, setBreed] = useState(cat?.breed ?? "");
  const [ageMonths, setAgeMonths] = useState(cat?.age_months?.toString() ?? "");
  const [gender, setGender] = useState<"male" | "female">(cat?.gender ?? "male");
  const [color, setColor] = useState(cat?.color ?? "");
  const [description, setDescription] = useState(cat?.description ?? "");
  const [listingType, setListingType] = useState<"vente" | "adoption">(cat?.listing_type ?? "vente");
  const [price, setPrice] = useState(cat?.price?.toString() ?? "");
  const [city, setCity] = useState(cat?.city ?? "");
  const [vaccinated, setVaccinated] = useState(cat?.vaccinated ?? false);
  const [sterilized, setSterilized] = useState(cat?.sterilized ?? false);
  const [status, setStatus] = useState(cat?.status ?? "disponible");
  const [ownerName, setOwnerName] = useState(cat?.owner_name ?? "");
  const [ownerPhone, setOwnerPhone] = useState(cat?.owner_phone ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    cat?.image ? `${BASE_URL}/storage/${cat.image}` : null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (listingType === "vente" && !price) {
      setError("Le prix est obligatoire pour une vente.");
      return;
    }
    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("breed", breed ?? "");
    if (ageMonths) formData.append("age_months", ageMonths);
    formData.append("gender", gender);
    formData.append("color", color ?? "");
    formData.append("description", description ?? "");
    formData.append("listing_type", listingType);
    if (price) formData.append("price", price);
    formData.append("city", city ?? "");
    formData.append("vaccinated", vaccinated ? "1" : "0");
    formData.append("sterilized", sterilized ? "1" : "0");
    formData.append("status", status);
    formData.append("owner_name", ownerName ?? "");
    formData.append("owner_phone", ownerPhone ?? "");
    if (imageFile) formData.append("image", imageFile);

    try {
      if (isEdit && cat) {
        await updateCatListing(cat.id, formData);
      } else {
        await createCatListing(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Vérifiez les champs.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-orange-100 sticky top-0 bg-white rounded-t-3xl">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? "Modifier le chat" : "Ajouter un chat"}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Image */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Photo</label>
            <label className="flex items-center gap-4 cursor-pointer">
              <div className="w-20 h-20 rounded-2xl bg-orange-50 border-2 border-dashed border-orange-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-5 h-5 text-orange-300" />
                )}
              </div>
              <span className="text-xs text-gray-500">Cliquez pour choisir une image</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)} />
            </label>
          </div>

          {/* Listing type */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Type d'annonce</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setListingType("vente")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border ${
                  listingType === "vente" ? "bg-[#1E3A6E] text-white border-[#1E3A6E]" : "border-gray-200 text-gray-600"
                }`}
              >
                À vendre
              </button>
              <button
                type="button"
                onClick={() => setListingType("adoption")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border ${
                  listingType === "adoption" ? "bg-[#E07A3F] text-white border-[#E07A3F]" : "border-gray-200 text-gray-600"
                }`}
              >
                À adopter
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Nom</label>
            <input
              required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          {/* Breed + color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Race</label>
              <input
                value={breed} onChange={(e) => setBreed(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Couleur</label>
              <input
                value={color} onChange={(e) => setColor(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          {/* Gender + age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Sexe</label>
              <select
                value={gender} onChange={(e) => setGender(e.target.value as "male" | "female")}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              >
                <option value="male">Mâle</option>
                <option value="female">Femelle</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Âge (mois)</label>
              <input
                type="number" min="0" value={ageMonths} onChange={(e) => setAgeMonths(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          {/* Price (only for vente) + city */}
          <div className="grid grid-cols-2 gap-3">
            {listingType === "vente" && (
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Prix (MAD)</label>
                <input
                  required type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            )}
            <div className={listingType === "adoption" ? "col-span-2" : ""}>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Ville</label>
              <input
                value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Statut</label>
            <select
              value={status} onChange={(e) => setStatus(e.target.value as CatListing["status"])}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            >
              <option value="disponible">Disponible</option>
              <option value="reserve">Réservé</option>
              {listingType === "vente" ? (
                <option value="vendu">Vendu</option>
              ) : (
                <option value="adopte">Adopté</option>
              )}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Description</label>
            <textarea
              rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none"
            />
          </div>

          {/* Owner contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Nom du propriétaire</label>
              <input
                value={ownerName} onChange={(e) => setOwnerName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Téléphone</label>
              <input
                value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={vaccinated} onChange={(e) => setVaccinated(e.target.checked)} className="accent-orange-600 w-4 h-4" />
              Vacciné
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={sterilized} onChange={(e) => setSterilized(e.target.checked)} className="accent-orange-600 w-4 h-4" />
              Stérilisé
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button
              type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-600 to-orange-400 text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}