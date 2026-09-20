import { XCircle, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import truncateWords from "../../utils/truncateWords";
import { useNavigate } from "react-router-dom";
import { groupCartItems } from "../../utils/groupCartItems";

interface PropsCartShoping {
  onClose: () => void;
}

export default function CartShoping({ onClose }: PropsCartShoping) {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { items, updateQuantity, removeFromCart, totalPrice, closeCart } = useCart();
  const groups = groupCartItems(items);
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-white"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* header */}
      <div className="border-b border-gray-100 shrink-0">
        <div className="flex justify-between items-center px-4 sm:px-5 py-4">
          <h3 className="text-base sm:text-lg font-semibold text-[#1E3A6E]">
            Panier {items.length > 0 && <span className="text-gray-400 font-normal">({items.length})</span>}
          </h3>
          <button onClick={onClose} aria-label="Fermer" className="text-gray-400 hover:text-red-500 transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-2">
          <span className="text-4xl mb-1">🛒</span>
          <p className="text-gray-500 text-sm font-medium">Ton panier est vide</p>
          <p className="text-gray-400 text-xs">Ajoute des articles pour les retrouver ici</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 flex flex-col gap-5">
          {groups.map((group) => (
            <div key={group.groupKey} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="flex gap-3 mb-3">
                <img
                  src={`${BASE_URL}/storage/${group.image}`}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                  alt={group.name}
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm sm:text-[15px] text-[#1E3A6E] truncate">
                    {truncateWords(group.name)}
                  </p>
                  {group.colorLabel && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                      {group.colorHex && (
                        <span
                          className="w-3 h-3 rounded-full inline-block border border-gray-200"
                          style={{ backgroundColor: group.colorHex }}
                        />
                      )}
                      {group.colorLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* one sub-row per size/variant */}
              <div className="flex flex-col gap-2">
                {group.lines.map((line) => {
                  const sizeAttr = line.variant?.attributes.find((a) => !a.hex_code);
                  return (
                    <div
                      key={line.lineKey}
                      className="flex items-center justify-between gap-2 bg-gray-50/60 rounded-xl px-3 py-2"
                    >
                      <span className="text-xs sm:text-sm text-gray-500 shrink-0">
                        {sizeAttr?.value ?? "—"}
                      </span>

                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <button
                          onClick={() => updateQuantity(line.lineKey, line.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#FF7A45] hover:text-[#FF7A45] transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-medium">{line.quantity}</span>
                        <button
                          onClick={() => updateQuantity(line.lineKey, line.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#FF7A45] hover:text-[#FF7A45] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-semibold text-sm text-[#FF7A45] whitespace-nowrap shrink-0">
                        {line.price} Dhs
                      </span>

                      <button
                        onClick={() => removeFromCart(line.lineKey)}
                        aria-label="Supprimer"
                        className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="border-t border-gray-100 p-4 sm:p-5 flex flex-col gap-3 shrink-0 bg-white">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-500 font-medium">Total</span>
            <span className="text-lg sm:text-xl font-bold text-[#1E3A6E]">
              {totalPrice.toFixed(2)} <span className="text-[#FF7A45]">Dhs</span>
            </span>
          </div>
          <button
            onClick={() => { navigate('/checkout'); closeCart(); }}
            className="w-full bg-[#FF7A45] hover:bg-[#e96936] transition-colors text-white rounded-full py-3 sm:py-3.5 font-bold text-sm sm:text-base"
          >
            Passer la commande
          </button>
        </div>
      )}
    </div>
  );
}