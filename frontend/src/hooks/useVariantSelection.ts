import { useEffect, useMemo, useState } from "react";
import { getCategoryAttributeTypes } from "../api/Adminservice";
import type { AttributeType } from "../types/admin";
import type { Variant } from "../components/clients/ProductDetails/ProductVariantSelector";

function buildSelectionFromVariant(variant: Variant, types: AttributeType[]) {
    const sel: Record<number, number> = {};
    variant.attribute_values.forEach((av) => {
        const type = types.find((t) => t.values.some((v) => v.id === av.id));
        if (type) sel[type.id] = av.id;
    });
    return sel;
}

export function useVariantSelection(variants: Variant[], categoryId: number | null) {
    const [types, setTypes] = useState<AttributeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Record<number, number>>({});

    useEffect(() => {
        if (!categoryId) { setTypes([]); setLoading(false); return; }
        setLoading(true);
        getCategoryAttributeTypes(categoryId)
            .then((res) => setTypes(res.data.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [categoryId]);

    // Stable content-based key — safe even if caller passes a fresh array each render
    const variantsKey = useMemo(
        () => variants.map((v) => v.id).join(","),
        [variants]
    );

    // Reset selection whenever the actual set of variants changes (not just array reference)
    useEffect(() => {
        setSelected({});
    }, [variantsKey]);

    // Only keep types/values that actually appear in this product's variants
    const groupedByType = useMemo(() => {
        if (types.length === 0 || variants.length === 0) return [];
        const usedValueIds = new Set(variants.flatMap((v) => v.attribute_values.map((av) => av.id)));
        return types
            .map((t) => ({ type: t, values: t.values.filter((v) => usedValueIds.has(v.id)) }))
            .filter((g) => g.values.length > 0);
    }, [types, variants]);

    // Default to the first variant's combination once data is ready
    useEffect(() => {
        if (loading) return;
        if (groupedByType.length === 0) return;
        if (Object.keys(selected).length > 0) return;
        if (variants.length === 0) return;
        setSelected(buildSelectionFromVariant(variants[0], types));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, variantsKey, types]);

    const colorGroup = groupedByType.find((g) => g.type.slug === "color");
    

    // Sizes/weights available for the CURRENTLY SELECTED color only.
    // Falls back to the full set if there's no color type, or none selected yet.
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

    const selectValue = (typeId: number, valueId: number) => {
        setSelected((prev) => {
            const next = { ...prev, [typeId]: valueId };

            // Changing the color invalidates any previously chosen size/weight that
            // doesn't exist for the new color — clear those so selection stays consistent.
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

    const isComplete = groupedByType.length === 0 || groupedByType.every((g) => selected[g.type.id] != null);

    return {
        loading,
        types,
        groupedByType,
        colorGroup,
        otherGroups,
        selected,
        selectValue,
        matchedVariant,
        hasVariants: variants.length > 0,
        isComplete,
    };
}