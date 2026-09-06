import { useMemo } from "react";
import type { Variant, AttributeValue } from "./ProductVariantSelector";
import type { AttributeType } from "../../../types/admin";

type Group = { type: AttributeType; values: AttributeValue[] };

type Props = {
    variants: Variant[];
    colorGroup: Group | undefined;            // undefined if this category has no color attribute
    selectedColorValueId: number | null;
    onSelectColor: (typeId: number, valueId: number) => void;
};

export default function ProductVariantImages({ variants, colorGroup, selectedColorValueId, onSelectColor }: Props) {
    const url = import.meta.env.VITE_API_URL;

    const colorValueIds = useMemo(
        () => new Set(colorGroup?.values.map((v) => v.id) ?? []),
        [colorGroup]
    );

    // One thumbnail per distinct color (or per distinct image if there's no color attribute at all)
    // — always the same { variant, colorValueId } shape, regardless of branch
    const uniqueVariants = useMemo(() => {
        if (colorValueIds.size === 0) {
            const seenImages = new Set<string>();
            const result: { variant: Variant; colorValueId: number }[] = [];
            for (const v of variants) {
                const imgKey = v.image_path ?? `no-image-${v.id}`;
                if (seenImages.has(imgKey)) continue;
                seenImages.add(imgKey);
                result.push({ variant: v, colorValueId: -1 });
            }
            return result;
        }
        const seenColors = new Set<number>();
        const result: { variant: Variant; colorValueId: number }[] = [];
        for (const v of variants) {
            const colorId = v.attribute_values.find((av) => colorValueIds.has(av.id))?.id;
            if (colorId != null && seenColors.has(colorId)) continue;
            if (colorId != null) seenColors.add(colorId);
            result.push({ variant: v, colorValueId: colorId ?? -1 });
        }
        return result;
    }, [variants, colorValueIds]);

    if (variants.length === 0) return null;

    return (
        <div className="mt-4 flex gap-4 flex-wrap">
            {uniqueVariants.map(({ variant: vr, colorValueId }) => {
                const isSelected = colorGroup
                    ? selectedColorValueId === colorValueId
                    : false;
                return (
                    <div
                        key={vr.id}
                        className={`w-20 h-20 rounded-lg relative cursor-pointer border ${
                            isSelected ? "border-blue-500" : "border-transparent"
                        }`}
                        onClick={() => {
                            if (colorGroup && colorValueId !== -1) {
                                onSelectColor(colorGroup.type.id, colorValueId);
                            }
                        }}
                    >
                        
                        <img
                            className="w-full h-full object-cover rounded-lg"
                            src={`${url}/storage/${vr.image_path}`}
                            alt=""
                        />
                    </div>
                );
            })}
        </div>
    );
}