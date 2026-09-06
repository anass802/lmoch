import { useEffect, useState, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import type { Product, Category, Species } from "../../types/Clients";
import { createProduct, updateProduct, getSpecies, saveProductVariants } from "../../api/Adminservice";
import VariantAttributesPicker, { type VariantPickerHandle } from "../Dashboard/Products/VariantAttributesPicker";

const BASE_URL = import.meta.env.VITE_API_URL;

type Props = {
    product: Product | null | undefined; // null = create, object = edit
    categories: Category[];
    onClose: () => void;
    onSaved: () => void;
};

export default function ProductModal({ product, categories, onClose, onSaved }: Props) {
    const isEdit = !!product;

    const [species, setSpecies] = useState<Species[]>([]);
    const [name, setName] = useState(product?.name ?? "");
    const [description, setDescription] = useState(product?.description ?? "");
    const [price, setPrice] = useState(product?.price?.toString() ?? "");
    const [oldPrice, setOldPrice] = useState(product?.old_price?.toString() ?? "");
    const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
    const [categoryId, setCategoryId] = useState<number | null>(product?.category_id ?? null);
    const [speciesId, setSpeciesId] = useState<number | null>(product?.species_id ?? null);
    const [isPromo, setIsPromo] = useState(product?.is_promo ?? false);
    const [isBest, setIsBest] = useState(product?.is_best ?? false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        product?.image ? `${BASE_URL}/storage/${product.image}` : null
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSpecies().then((res) => setSpecies(res.data.data)).catch((err) => console.error(err));
    }, []);

    const handleImageChange = (file: File | null) => {
        setImageFile(file);
        if (file) setImagePreview(URL.createObjectURL(file));
    };
    const variantRef = useRef<VariantPickerHandle>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId || !speciesId) {
            setError("Catégorie et espèce sont obligatoires.");
            return;
        }
        setSaving(true);
        setError(null);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description ?? "");
        formData.append("price", price);
        if (oldPrice) formData.append("old_price", oldPrice);
        formData.append("stock", stock);
        formData.append("category_id", String(categoryId));
        formData.append("species_id", String(speciesId));
        formData.append("is_promo", isPromo ? "1" : "0");
        formData.append("is_best", isBest ? "1" : "0");
        if (imageFile) formData.append("image", imageFile);

        try {
            let productId = product?.id;
            if (isEdit && product) {
                await updateProduct(product.id, formData);
            } else {
                const res = await createProduct(formData);
                productId = res.data.data.id
            }
            const combinations = variantRef.current?.getCombinations() ?? [];
            if (productId && combinations.length > 0) {
                const variantForm = new FormData();
                combinations.forEach((combo, i) => {
                    combo.attribute_value_ids.forEach((id) =>
                        variantForm.append(`combinations[${i}][attribute_value_ids][]`, String(id))
                    );
                    variantForm.append(`combinations[${i}][stock]`, String(combo.stock));
                    if (combo.image) variantForm.append(`combinations[${i}][image]`, combo.image);
                });
                await saveProductVariants(productId, variantForm);
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
                        {isEdit ? "Modifier le produit" : "Ajouter un produit"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
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
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Image</label>
                        <label className="flex items-center gap-4 cursor-pointer">
                            <div className="w-20 h-20 rounded-2xl bg-orange-50 border-2 border-dashed border-orange-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="w-5 h-5 text-orange-300" />
                                )}
                            </div>
                            <span className="text-xs text-gray-500">Cliquez pour choisir une image</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                            />
                        </label>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Nom du produit</label>
                        <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Description</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none"
                        />
                    </div>

                    {/* Price row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Prix (MAD)</label>
                            <input
                                required type="number" step="0.01" min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Ancien prix</label>
                            <input
                                type="number" step="0.01" min="0"
                                value={oldPrice}
                                onChange={(e) => setOldPrice(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Stock</label>
                            <input
                                required type="number" min="0"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                            />
                        </div>
                    </div>

                    {/* Species + Category */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Espèce</label>
                            <select
                                required
                                value={speciesId ?? ""}
                                onChange={(e) => setSpeciesId(Number(e.target.value))}
                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                            >
                                <option value="" disabled>Choisir...</option>
                                {species.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Catégorie</label>
                            <select
                                required
                                value={categoryId ?? ""}
                                onChange={(e) => setCategoryId(Number(e.target.value))}
                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                            >
                                <option value="" disabled>Choisir...</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Flags */}
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input type="checkbox" checked={isPromo} onChange={(e) => setIsPromo(e.target.checked)} className="accent-orange-600 w-4 h-4" />
                            En promotion
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input type="checkbox" checked={isBest} onChange={(e) => setIsBest(e.target.checked)} className="accent-orange-600 w-4 h-4" />
                            Meilleure vente
                        </label>
                    </div>

                    {/* Variants — color / size / weight-kg / weight-L, driven by chosen category */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Variantes (selon la catégorie)</label>
                        <VariantAttributesPicker ref={variantRef} categoryId={categoryId} productId={product?.id} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
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