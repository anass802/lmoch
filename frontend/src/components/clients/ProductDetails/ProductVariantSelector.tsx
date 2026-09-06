// components/Products/ProductVariantSelector.tsx
import { Palette, Ruler, Weight } from "lucide-react";
import type { AttributeType } from "../../../types/admin";

const TYPE_ICONS: Record<string, React.ElementType> = {
  color: Palette, size: Ruler, "weight-kg": Weight, "weight-l": Weight,
};

export type AttributeValue = { id: number; value: string; hex_code?: string | null };
export type Variant = {
  id: number;
  stock: number;
  image_path: string | null;
  attribute_values: AttributeValue[]; // flat, no nested type
};

type Group = { type: AttributeType; values: AttributeValue[] };

type Props = {
  groups: Group[];                          // groups to render (caller decides which — usually "otherGroups", excluding color)
  selected: Record<number, number>;         // typeId -> valueId, shared/controlled by parent
  onSelect: (typeId: number, valueId: number) => void;
  loading?: boolean;
};

export default function ProductVariantSelector({ groups, selected, onSelect, loading }: Props) {
  if (loading) return null;
  if (groups.length === 0) return null;

  return (
    <div className="space-y-4">
      {groups.map(({ type, values }) => {
        const Icon = TYPE_ICONS[type.slug] ?? Palette;
        return (
          <div key={type.id}>
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
                    onClick={() => onSelect(type.id, value.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-[#1E3A6E] border-[#1E3A6E] text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-orange-300"
                    }`}
                  >
                    {value.hex_code && (
                      <span
                        className="w-3 h-3 rounded-full border border-black/10"
                        style={{ backgroundColor: value.hex_code }}
                      />
                    )}
                    {value.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}