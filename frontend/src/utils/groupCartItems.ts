
import type { CartItem } from "../context/CartContext";

export interface CartGroup {
    groupKey: string;       // productId + color signature
    id: number;
    name: string;
    image: string | null;
    colorLabel: string | null;
    colorHex: string | null;
    lines: CartItem[];      // one per size/variant within this color+product
}

export function groupCartItems(items: CartItem[]): CartGroup[] {
    const map = new Map<string, CartGroup>();

    for (const item of items) {
        const colorAttr = item.variant?.attributes.find((a) => a.hex_code);
        const colorKey = colorAttr?.value ?? "no-color";
        const groupKey = `${item.id}-${colorKey}`;

        const existing = map.get(groupKey);
        if (existing) {
            existing.lines.push(item);
        } else {
            map.set(groupKey, {
                groupKey,
                id: item.id,
                name: item.name,
                image: item.image,
                colorLabel: colorAttr?.value ?? null,
                colorHex: colorAttr?.hex_code ?? null,
                lines: [item],
            });
        }
    }

    return Array.from(map.values());
}