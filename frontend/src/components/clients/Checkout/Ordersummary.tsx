import { ShoppingBag, Coins } from "lucide-react";
import { getpointsBalance, getToken } from "../../../api/auth/AuthService";
import { useCart } from "../../../context/CartContext";
import truncateWords from "../../../utils/truncateWords";
import type { InfoClientState } from "../../../types/Clients";

interface ShippingProps {
    shipping: number;
    form: InfoClientState;
    setForm: React.Dispatch<React.SetStateAction<InfoClientState>>;
    onSubmit: () => void
    emballageError: string;
}
type EmballageType = 'gratuit' | 'standard' | 'premium';

const EMBALLAGE_PRICES: Record<EmballageType, number> = {
    gratuit: 0,
    standard: 5,
    premium: 10,
};

export default function OrderSummary({ shipping, form, setForm, onSubmit, emballageError }: ShippingProps) {

    const url = import.meta.env.VITE_API_URL
    const { items, totalPrice, updateQuantity } = useCart()

    const points = Number(getpointsBalance() ?? 0);
    const isLoggedIn = !!getToken();

    const emballageCost = form.emballage ? EMBALLAGE_PRICES[form.emballage as EmballageType] : 0;

    // Grand total before any points discount (frontend display only —
    // the backend recalculates everything independently on submit).
    const grandTotal = totalPrice + shipping + emballageCost;
    const usingPoints = form.paid_by === "points";
    const amountDue = usingPoints ? Math.max(grandTotal - points, 0) : grandTotal;

    const handlePointsToggle = (checked: boolean) => {
        if (checked) {
            setForm((prev) => ({
                ...prev,
                paid_by: "points",
                points_used: Math.min(points, grandTotal), // never send more than what's actually needed
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                paid_by: "money",
                points_used: 0,
            }));
        }
    };

    return (
        <div className="w-full p-6 border border-gray-100 rounded-2xl shadow-sm bg-white h-fit lg:sticky lg:top-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-[#1E3A6E] font-bold text-base">Récapitulatif de commande</h3>
            </div>

            <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            <img src={`${url}/storage/${item.image}`} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-800 truncate">{truncateWords(item.name)}</p>
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-500">Qté: {item.quantity}</span>
                                <span className="text-xs text-gray-500">{item.value}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <p className="text-sm font-semibold text-[#1E3A6E] shrink-0">
                                {(item.price * item.quantity).toFixed(2)} DH
                            </p>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => updateQuantity(item.lineKey, item.quantity - 1)}
                                    className="px-2 py-1 text-xs text-orange-500 hover:bg-orange-50 transition">
                                    −
                                </button>
                                <span className="px-3 text-xs font-semibold text-[#1E3A6E]">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item.lineKey, item.quantity + 1)}
                                    className="px-2 py-1 text-xs text-orange-500 hover:bg-orange-50 transition">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 my-5" />

            {isLoggedIn && (
                <div className="rounded-lg bg-orange-50/60 px-3 py-2.5 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-orange-600">
                            <Coins className="h-5 w-5 text-orange-400" />
                            <span className="text-sm font-medium">
                                Utiliser mes points: <span className="text-[#1E3A6E] text-xs font-bold">{points}</span>
                            </span>
                        </div>
                        <input
                            type="checkbox"
                            checked={usingPoints}
                            onChange={(e) => handlePointsToggle(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 accent-orange-500 focus:ring-orange-400"
                        />
                    </div>

                    {usingPoints && (
                        <div className="mt-2 text-xs">
                            {points === 0 ? (
                                <p className="text-red-500">Aucun point à utiliser</p>
                            ) : points >= grandTotal ? (
                                <p className="text-emerald-600 font-medium">
                                    Vos points couvrent la totalité de la commande 🎉
                                </p>
                            ) : (
                                <p className="text-[#1E3A6E]">
                                    Vos points couvrent <span className="font-semibold">{points} DH</span> — il vous reste{" "}
                                    <span className="font-semibold">{(grandTotal - points).toFixed(2)} DH</span> à payer.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-500">
                    <span>Sous-total</span>
                    <span className="text-gray-700">{totalPrice} DH</span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span>Livraison</span>
                    <span className="text-gray-700">{shipping.toFixed(2)} DH</span>
                </div>
                {emballageCost > 0 && (
                    <div className="flex justify-between text-gray-500">
                        <span>Emballage</span>
                        <span className="text-gray-700">{emballageCost.toFixed(2)} DH</span>
                    </div>
                )}

                {usingPoints && points > 0 && (
                    <div className="flex justify-between text-emerald-600">
                        <span>Points utilisés</span>
                        <span>− {Math.min(points, grandTotal).toFixed(2)} DH</span>
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <div className="flex text-black justify-between">
                        <span className="text-gray-500">Emballage</span>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="emballage"
                                    value="gratuit"
                                    checked={form.emballage === 'gratuit'}
                                    onChange={(e) => setForm((prev) => ({
                                        ...prev,
                                        emballage: e.target.value as EmballageType
                                    }))}
                                    className="h-4 w-4 rounded border-gray-300 accent-orange-500 focus:ring-orange-400"
                                />
                                <span className="text-xs">Gratuit </span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="emballage"
                                    value="standard"
                                    checked={form.emballage === 'standard'}
                                    onChange={(e) => setForm((prev) => ({
                                        ...prev,
                                        emballage: e.target.value as EmballageType
                                    }))}
                                    className="h-4 w-4 rounded border-gray-300 accent-orange-500 focus:ring-orange-400"
                                />
                                <span className="text-xs">Standard 5dh</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="emballage"
                                    value="premium"
                                    checked={form.emballage === 'premium'}
                                    onChange={(e) => setForm((prev) => ({
                                        ...prev,
                                        emballage: e.target.value as EmballageType
                                    }))}
                                    className="h-4 w-4 rounded border-gray-300 accent-orange-500 focus:ring-orange-400"
                                />
                                <span className="text-xs">Premium 10dh</span>
                            </label>
                        </div>
                    </div>
                    {emballageError && (
                        <p className="text-red-500 text-xs mt-1">
                            {emballageError}
                        </p>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-100 my-4" />

            <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-[#1E3A6E]">Total</span>
                <div className="text-right">
                    {usingPoints && points > 0 && (
                        <p className="text-xs text-gray-400 line-through">{grandTotal.toFixed(2)} DH</p>
                    )}
                    <span className="font-bold text-lg text-orange-500">{amountDue.toFixed(2)} DH</span>
                </div>
            </div>

            <button
                onClick={onSubmit}
                type="button"
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm py-3 transition-colors"
            >
                Passer la commande
            </button>
        </div>
    );
}