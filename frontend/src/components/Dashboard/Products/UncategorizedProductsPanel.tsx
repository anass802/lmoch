import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import type { Product, Category, Species } from "../../../types/Clients";

import { updateProductCategory } from "../../../api/Adminservice"; 

type Props = {
  products: Product[];
  categories: Category[];
  species: Species[];
  onUpdated: (productId: number) => void;
};

export default function UncategorizedProductsPanel({ products, categories, species, onUpdated }: Props) {
  const [drafts, setDrafts] = useState<Record<number, { category_id?: number; species_id?: number }>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  if (products.length === 0) return null;

  const setDraft = (productId: number, field: "category_id" | "species_id", value: number) => {
    setDrafts((prev) => ({ ...prev, [productId]: { ...prev[productId], [field]: value } }));
  };

  const handleSave = async (productId: number) => {
    const draft = drafts[productId];
    if (!draft?.category_id || !draft?.species_id) return;
    setSavingId(productId);
    try {
      await updateProductCategory(productId, { category_id: draft.category_id, species_id: draft.species_id });
      onUpdated(productId);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <h2 className="text-sm font-bold text-amber-800">
          {products.length} produit{products.length > 1 ? "s" : ""} sans catégorie ou espèce
        </h2>
      </div>
      <div className="space-y-2">
        {products.map((product) => {
          const draft = drafts[product.id] ?? {};
          const canSave = draft.category_id && draft.species_id;
          return (
            <div key={product.id} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white rounded-xl border border-amber-100 px-4 py-3">
              <span className="text-sm font-medium text-gray-800 flex-1 truncate">{product.name}</span>

              <select
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                value={draft.species_id ?? ""}
                onChange={(e) => setDraft(product.id, "species_id", Number(e.target.value))}
              >
                <option value="" disabled>Espèce...</option>
                {species.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <select
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                value={draft.category_id ?? ""}
                onChange={(e) => setDraft(product.id, "category_id", Number(e.target.value))}
              >
                <option value="" disabled>Catégorie...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <button
                onClick={() => handleSave(product.id)}
                disabled={!canSave || savingId === product.id}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                {savingId === product.id ? "..." : "Valider"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}