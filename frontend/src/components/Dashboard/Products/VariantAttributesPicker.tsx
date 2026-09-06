import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Palette, Ruler, Weight, Upload } from "lucide-react";
import type { AttributeType } from "../../../types/admin";
import { getCategoryAttributeTypes, getProductVariants } from "../../../api/Adminservice";

const BASE_URL = import.meta.env.VITE_API_URL;

const TYPE_ICONS: Record<string, React.ElementType> = {
  color: Palette, size: Ruler, "weight-kg": Weight, "weight-l": Weight,
};

type Props = { categoryId: number | null; productId?: number };

export type VariantCombination = {
  attribute_value_ids: number[];
  stock: number;
  image: File | null;
  existing_image_path?: string | null;
};

export type VariantPickerHandle = { getCombinations: () => VariantCombination[] };

const NO_COLOR_KEY = "__no_color__";

const VariantAttributesPicker = forwardRef<VariantPickerHandle, Props>(
  ({ categoryId, productId }, ref) => {
    const [types, setTypes] = useState<AttributeType[]>([]);
    const [selected, setSelected] = useState<Record<number, Set<number>>>({});
    const [loading, setLoading] = useState(false);

    // image stored per color value id (or NO_COLOR_KEY when the category has no color type)
    const [images, setImages] = useState<Record<string, { file: File | null; preview: string | null; existingPath: string | null }>>({});
    // stock stored per full combination key (sorted attribute value ids joined with "-")
    const [stocks, setStocks] = useState<Record<string, string>>({});

    useEffect(() => {
      if (!categoryId) { setTypes([]); return; }
      setLoading(true);
      getCategoryAttributeTypes(categoryId)
        .then((res) => setTypes(res.data.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, [categoryId]);

    const colorType = useMemo(() => types.find((t) => t.slug === "color"), [types]);
    const otherTypes = useMemo(() => types.filter((t) => t.slug !== "color"), [types]);

    // Preload existing selections + stock/image when editing
    useEffect(() => {
      if (!productId || types.length === 0) return;
      getProductVariants(productId)
        .then((res) => {
          const nextSelected: Record<number, Set<number>> = {};
          const nextStocks: Record<string, string> = {};
          const nextImages: typeof images = {};

          res.data.data.forEach((variant) => {
            const valueIds: number[] = [];
            let colorValueId: number | null = null;

            variant.attribute_values.forEach((v) => {
              types.forEach((t) => {
                if (t.values.some((tv) => tv.id === v.id)) {
                  nextSelected[t.id] = nextSelected[t.id] ?? new Set();
                  nextSelected[t.id].add(v.id);
                  valueIds.push(v.id);
                  if (t.slug === "color") colorValueId = v.id;
                }
              });
            });

            const comboKey = [...valueIds].sort((a, b) => a - b).join("-");
            nextStocks[comboKey] = String(variant.stock ?? 0);

            const imageKey = colorValueId != null ? String(colorValueId) : NO_COLOR_KEY;
            if (variant.image_path && !nextImages[imageKey]) {
              nextImages[imageKey] = {
                file: null,
                preview: `${BASE_URL}/storage/${variant.image_path}`,
                existingPath: variant.image_path,
              };
            }
          });

          setSelected(nextSelected);
          setStocks((prev) => ({ ...prev, ...nextStocks }));
          setImages((prev) => ({ ...prev, ...nextImages }));
        })
        .catch((err) => console.error(err));
    }, [productId, types.length]);

    const toggleValue = (typeId: number, valueId: number) => {
      setSelected((prev) => {
        const next = { ...prev };
        const set = new Set(next[typeId] ?? []);
        set.has(valueId) ? set.delete(valueId) : set.add(valueId);
        next[typeId] = set;
        return next;
      });
    };

    // Groups: one entry per selected color (or a single "no color" group), each holding
    // the full combinations (color + other attrs) that belong to it.
    const colorGroups = useMemo(() => {
      const otherGroups = otherTypes
        .map((t) => Array.from(selected[t.id] ?? []))
        .filter((a) => a.length > 0);

      const otherCombos: number[][] = otherGroups.length === 0
        ? [[]]
        : otherGroups.reduce<number[][]>(
            (acc, group) => acc.flatMap((combo) => group.map((v) => [...combo, v])),
            [[]]
          );

      const colorValueIds = colorType ? Array.from(selected[colorType.id] ?? []) : [];

      if (colorType && colorValueIds.length > 0) {
        return colorValueIds.map((colorId) => ({
          key: String(colorId),
          colorId,
          combinations: otherCombos.map((c) => [colorId, ...c].sort((a, b) => a - b)),
        }));
      }

      // no color type in this category, or none selected yet: one flat group
      if (otherCombos.length === 1 && otherCombos[0].length === 0) return [];
      return [{ key: NO_COLOR_KEY, colorId: null, combinations: otherCombos.map((c) => [...c].sort((a, b) => a - b)) }];
    }, [colorType, otherTypes, selected]);

    const setImageForGroup = (groupKey: string, file: File | null) => {
      setImages((prev) => {
        const current = prev[groupKey] ?? { file: null, preview: null, existingPath: null };
        return {
          ...prev,
          [groupKey]: {
            ...current,
            file,
            preview: file ? URL.createObjectURL(file) : current.preview,
          },
        };
      });
    };

    const setStockForCombo = (comboKey: string, value: string) => {
      setStocks((prev) => ({ ...prev, [comboKey]: value }));
    };

    const buildCombinations = (): VariantCombination[] => {
      const result: VariantCombination[] = [];
      colorGroups.forEach((group) => {
        const img = images[group.key];
        group.combinations.forEach((ids) => {
          const comboKey = ids.join("-");
          result.push({
            attribute_value_ids: ids,
            stock: Number(stocks[comboKey] ?? 0),
            image: img?.file ?? null,
            existing_image_path: img?.existingPath ?? null,
          });
        });
      });
      return result;
    };

    useImperativeHandle(ref, () => ({ getCombinations: buildCombinations }));

    const valueById = (id: number) => {
      for (const t of types) {
        const v = t.values.find((val) => val.id === id);
        if (v) return v;
      }
      return null;
    };

    if (!categoryId) return <p className="text-xs text-gray-400 italic">Choisissez une catégorie pour voir les variantes disponibles.</p>;
    if (loading) return <p className="text-xs text-gray-400">Chargement des variantes...</p>;
    if (types.length === 0) return <p className="text-xs text-gray-400 italic">Cette catégorie n'a pas de variantes (couleur/taille/poids).</p>;

    const totalCombos = colorGroups.reduce((sum, g) => sum + g.combinations.length, 0);

    return (
      <div className="space-y-4 border border-orange-100 rounded-2xl p-4 bg-orange-50/30">
        {types.map((type) => {
          const Icon = TYPE_ICONS[type.slug] ?? Palette;
          return (
            <div key={type.id}>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-2">
                <Icon className="w-3.5 h-3.5 text-orange-600" /> {type.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {type.values.map((value) => {
                  const isSelected = selected[type.id]?.has(value.id) ?? false;
                  return (
                    <button
                      key={value.id} type="button"
                      onClick={() => toggleValue(type.id, value.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-orange-300"
                      }`}
                    >
                      {value.hex_code && <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: value.hex_code }} />}
                      {value.value}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {colorGroups.length > 0 && (
          <div className="space-y-4 pt-3 border-t border-orange-100">
            <p className="text-xs font-semibold text-gray-600">
              {totalCombos} combinaison{totalCombos > 1 ? "s" : ""} — image par couleur, stock par taille
            </p>
            {colorGroups.map((group) => {
              const colorValue = group.colorId != null ? valueById(group.colorId) : null;
              const img = images[group.key];
              return (
                <div key={group.key} className="bg-white border border-gray-200 rounded-xl p-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex-shrink-0 w-14 h-14 rounded-xl bg-orange-50 border-2 border-dashed border-orange-200 flex items-center justify-center overflow-hidden cursor-pointer">
                      {img?.preview ? (
                        <img src={`${img.preview}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-4 h-4 text-orange-300" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setImageForGroup(group.key, e.target.files?.[0] ?? null)}
                      />
                    </label>

                    {colorValue ? (
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                        {colorValue.hex_code && (
                          <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: colorValue.hex_code }} />
                        )}
                        {colorValue.value}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-700">Toutes les variantes</span>
                    )}
                  </div>

                  <div className="space-y-2 pl-2">
                    {group.combinations.map((ids) => {
                      const comboKey = ids.join("-");
                      const otherIds = colorValue ? ids.filter((id) => id !== group.colorId) : ids;
                      return (
                        <div key={comboKey} className="flex items-center gap-3">
                          <div className="flex flex-wrap items-center gap-1.5 flex-1">
                            {otherIds.length > 0 ? (
                              otherIds.map((id) => {
                                const v = valueById(id);
                                return (
                                  <span key={id} className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-2 py-1">
                                    {v?.value ?? id}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-xs text-gray-400 italic">—</span>
                            )}
                          </div>
                          <div className="w-24 flex-shrink-0">
                            <input
                              type="number"
                              min="0"
                              placeholder="Stock"
                              value={stocks[comboKey] ?? ""}
                              onChange={(e) => setStockForCombo(comboKey, e.target.value)}
                              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

export default VariantAttributesPicker;