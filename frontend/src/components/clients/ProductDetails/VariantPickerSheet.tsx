import { useEffect, useMemo, useState } from "react";
import { Palette, Ruler, Weight } from "lucide-react";
import { getCategoryAttributeTypes } from "../../../api/Adminservice";
import type { AttributeType } from "../../../types/admin";
import type { Product } from "../../../types/Clients";
import type { Variant } from "./ProductVariantSelector";

const TYPE_ICONS: Record<string, React.ElementType> = {
    color: Palette,
    size: Ruler,
    "weight-kg": Weight,
    "weight-l": Weight,
};

interface VariantPickerSheetProps {
    product: Product; // must already include `variants` (with attribute_values) from the list/detail API
    onClose: () => void;
    onConfirm: (variant: Variant) => void;
}

export default function VariantPickerSheet({ product, onClose, onConfirm }: VariantPickerSheetProps) {
    const url = import.meta.env.VITE_API_URL;
    const categoryId = product.category_id ?? null;
    const variants = useMemo(() => (product.variants ?? []) as Variant[], [product.variants]);

    const [types, setTypes] = useState<AttributeType[]>([]);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [selected, setSelected] = useState<Record<number, number>>({}); // typeId -> valueId

    useEffect(() => {
        if (!categoryId) { setTypes([]); setLoadingTypes(false); return; }
        setLoadingTypes(true);
        getCategoryAttributeTypes(categoryId)
            .then((res) => setTypes(res.data.data))
            .catch((err) => console.error(err))
            .finally(() => setLoadingTypes(false));
    }, [categoryId]);

    // Only keep types/values that actually appear in this product's variants
    const groupedByType = useMemo(() => {
        if (types.length === 0 || variants.length === 0) return [];
        const usedValueIds = new Set(variants.flatMap((v) => v.attribute_values.map((av) => av.id)));
        return types
            .map((t) => ({ type: t, values: t.values.filter((v) => usedValueIds.has(v.id)) }))
            .filter((g) => g.values.length > 0);
    }, [types, variants]);

    const colorGroup = groupedByType.find((g) => g.type.slug === "color");
    const colorValueIds = useMemo(
        () => new Set(colorGroup?.values.map((v) => v.id) ?? []),
        [colorGroup]
    );

    // Sizes/weights available for the CURRENTLY SELECTED color only.
    // If no color is selected yet (or there's no color attribute at all),
    // fall back to the full set derived from all variants.
    const otherGroups = useMemo(() => {
        const base = groupedByType.filter((g) => g.type.slug !== "color");

        if (!colorGroup) return base;

        const selectedColorId = selected[colorGroup.type.id];
        if (selectedColorId == null) return base;

        const variantsForColor = variants.filter((v) =>
            v.attribute_values.some((av) => av.id === selectedColorId)
        );
        const usedValueIds = new Set(variantsForColor.flatMap((v) => v.attribute_values.map((av) => av.id)));

        return base
            .map((g) => ({ ...g, values: g.values.filter((v) => usedValueIds.has(v.id)) }))
            .filter((g) => g.values.length > 0);
    }, [groupedByType, colorGroup, selected, variants]);

    // One thumbnail per distinct color, deduped by color value id
    const colorSwatches = useMemo(() => {
        if (!colorGroup) return [];
        const seen = new Set<number>();
        const result: { variant: Variant; colorValueId: number }[] = [];
        for (const v of variants) {
            const colorValueId = v.attribute_values.find((av) => colorValueIds.has(av.id))?.id;
            if (colorValueId == null || seen.has(colorValueId)) continue;
            seen.add(colorValueId);
            result.push({ variant: v, colorValueId });
        }
        return result;
    }, [variants, colorGroup, colorValueIds]);

    const matchedVariant = useMemo(() => {
        if (groupedByType.length === 0) return null;
        const allTypesSelected = groupedByType.every((g) => selected[g.type.id] != null);
        if (!allTypesSelected) return null;
        return (
            variants.find((variant) =>
                groupedByType.every((g) =>
                    variant.attribute_values.some((v) => v.id === selected[g.type.id])
                )
            ) ?? null
        );
    }, [groupedByType, selected, variants]);

    // Auto-confirm when the product effectively has no real choice to make
    useEffect(() => {
        if (loadingTypes) return;
        if (groupedByType.length === 0 && variants.length === 1) {
            onConfirm(variants[0]);
        }
    }, [loadingTypes, groupedByType, variants]);

    const previewImage = matchedVariant?.image_path
        ?? colorSwatches.find((s) => s.colorValueId === (colorGroup ? selected[colorGroup.type.id] : undefined))?.variant.image_path
        ?? colorSwatches[0]?.variant.image_path
        ?? product.image;

    const selectValue = (typeId: number, valueId: number) => {
        setSelected((prev) => {
            const next = { ...prev, [typeId]: valueId };

            // Changing the color invalidates any previously chosen size/weight that
            // doesn't exist for the new color — clear those so the UI/validation stay consistent.
            if (colorGroup && typeId === colorGroup.type.id) {
                const variantsForColor = variants.filter((v) =>
                    v.attribute_values.some((av) => av.id === valueId)
                );
                const usedValueIds = new Set(variantsForColor.flatMap((v) => v.attribute_values.map((av) => av.id)));

                groupedByType.forEach((g) => {
                    if (g.type.slug === "color") return;
                    const current = next[g.type.id];
                    if (current != null && !usedValueIds.has(current)) {
                        delete next[g.type.id];
                    }
                });
            }

            return next;
        });
    };

    const handleConfirm = () => {
        if (matchedVariant) onConfirm(matchedVariant);
    };

    if (!loadingTypes && groupedByType.length === 0 && variants.length !== 1) {
        return null; // nothing to pick, and not the auto-confirm single-variant case
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-[70]" onClick={onClose} />

            <div className="fixed inset-x-0 bottom-0 z-[80] md:inset-0 md:flex md:items-center md:justify-center md:bottom-auto">
                <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
                    <div className="md:hidden w-10 h-1 rounded-full bg-[#EFE7D8] mx-auto mb-4" />

                    <div className="flex items-start gap-3 mb-5">
                        {previewImage && (
                            <img
                                src={`${url}/storage/${previewImage}`}
                                alt={product.name}
                                className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-[#FAF7F1]"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-[#1E3A6E] leading-tight">
                                {product.name}
                            </h3>
                            <span className="text-sm font-bold text-[#FF7A45]">
                                {product.price} MAD
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-[#FAF7F1] flex items-center justify-center text-[#1E3A6E] flex-shrink-0"
                            aria-label="Fermer"
                        >
                            ✕
                        </button>
                    </div>

                    {loadingTypes && (
                        <p className="text-sm text-[#7A7268] text-center py-6">Chargement...</p>
                    )}

                    {!loadingTypes && colorGroup && (
                        <div className="mb-5">
                            <p className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A6E] mb-2">
                                <Palette className="w-3.5 h-3.5 text-orange-500" /> {colorGroup.type.name}
                            </p>
                            <div className="flex gap-3 flex-wrap">
                                {colorSwatches.map(({ variant, colorValueId }) => {
                                    const isSelected = selected[colorGroup.type.id] === colorValueId;
                                    return (
                                        <div
                                            key={variant.id}
                                            onClick={() => selectValue(colorGroup.type.id, colorValueId)}
                                            className={`w-16 h-16 rounded-lg relative cursor-pointer border-2 overflow-hidden ${
                                                isSelected ? "border-[#1E3A6E]" : "border-transparent"
                                            }`}
                                        >
                                            <img
                                                className="w-full h-full object-cover"
                                                src={`${url}/storage/${variant.image_path}`}
                                                alt=""
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!loadingTypes && otherGroups.map(({ type, values }) => {
                        const Icon = TYPE_ICONS[type.slug] ?? Palette;
                        return (
                            <div key={type.id} className="mb-5">
                                <p className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A6E] mb-2">
                                    <Icon className="w-3.5 h-3.5 text-orange-500" /> {type.name}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {values.map((value) => {
                                        const isSelected = selected[type.id] === value.id;
                                        return (
                                            <button
                                                key={value.id}
                                                type="button"
                                                onClick={() => selectValue(type.id, value.id)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                                    isSelected
                                                        ? "bg-[#1E3A6E] border-[#1E3A6E] text-white"
                                                        : "bg-white border-gray-200 text-gray-600 hover:border-orange-300"
                                                }`}
                                            >
                                                {value.value}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={handleConfirm}
                        disabled={!matchedVariant}
                        className={`w-full h-12 rounded-full font-semibold text-white transition-colors mt-2 ${
                            matchedVariant
                                ? "bg-[#1E3A6E] hover:bg-[#E07A3F]"
                                : "bg-[#D8D2C4] cursor-not-allowed"
                        }`}
                    >
                        Ajouter au panier
                    </button>
                </div>
            </div>
        </>
    );
}