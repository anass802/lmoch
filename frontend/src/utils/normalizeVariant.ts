// utils/normalizeVariant.ts
import type { Variant } from "../components/clients/ProductDetails/ProductVariantSelector"; // adjust path


export function normalizeVariantForCart(variant: Variant | null) {
    if (!variant) return null;
    return {
        id: variant.id,
        image_path: variant.image_path ?? null,
        attributes: variant.attribute_values.map((v) => ({
            value: v.value,
            hex_code: v.hex_code,
        })),
    };
}