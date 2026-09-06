import { useState } from "react";
import { Truck, ArrowLeft, } from "lucide-react";
import type { MoroccoCity } from "../../../data/moroccoCities";
import { useCart } from "../../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

type DeliveryMethod = "home" | "pickup";
type Props = {
    city: MoroccoCity | "";
    onShippingChange:(price:number)=>void
};

export default function DeliveryOptions({ city,onShippingChange }: Props) {
    const [method, setMethod] = useState<DeliveryMethod>("home");
    const FREE_CATEGORIES = [
        "Sac a dos & Cage",
        "Jouets",
        "Pharmacie",
        "Accessoires",
        "Vetements",
        "Coussin & niches",
    ];
    const requiredCount = city === "Casablanca" ? 4 : 6;
    const { items } = useCart()
    const eligibleCount = items
        .filter((item) => FREE_CATEGORIES.includes(item.category))
        .reduce((sum, item) => sum + item.quantity, 0);
    const remaining = Math.max(requiredCount - eligibleCount, 0);
    let colorClass = "text-red-500 bg-red-500/10";

    if (city === "Casablanca") {
        if (eligibleCount >= 4) {
            colorClass = "text-green-600 bg-green-500/10";
        } else if (eligibleCount >= 2) {
            colorClass = "text-orange-500 bg-orange-500/10";
        }
    } else {
        if (eligibleCount >= 6) {
            colorClass = "text-green-600 bg-green-500/10";
        } else if (eligibleCount >= 3) {
            colorClass = "text-orange-500 bg-orange-500/10";
        }
    }
    const message =
        eligibleCount >= requiredCount
            ? "🎉 Livraison gratuite activée !"
            : `Ajoutez encore ${remaining} produit(s) des catégories éligibles pour bénéficier de la livraison gratuite.`;

    const getShippingPrice = () => {
        if (!city) return 0;

        const basePrice = city === "Casablanca" ? 20 : 45;

        if (eligibleCount >= requiredCount) {
            return 0; // FREE
        }

        return basePrice;
    };
    useEffect(()=>{
        const shipping=getShippingPrice();
        onShippingChange(shipping)
    },[city,eligibleCount])
    const options: {
        key: DeliveryMethod;
        icon: React.ReactNode;
        title: string;
        badge?: string;
        subtitle: string;
        price: string;
        priceNote: string;
    }[] = [
            {
                key: "home",
                icon: <Truck className="h-5 w-5" />,
                title: "Livraison à domicile",
                badge: "Recommandé",
                subtitle: "Livraison rapide et sécurisée à votre adresse",
                price: `${getShippingPrice()}dh`,
                priceNote: "1-2 jours ouvrables",
            },

        ];

    return (
        <div className="w-full p-6 border border-gray-100 rounded-2xl shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-[#1E3A6E] font-bold text-base">Mode de livraison</h3>
            </div>

            <div className="flex flex-col gap-3">
                {options.map((opt) => {

                    return (
                        <button
                            key={opt.key}
                            type="button"
                            onClick={() => setMethod(opt.key)}
                            className="w-full flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors ${selected
                                    border-orange-400 bg-orange-50/40"


                        >
                            <div className="flex items-start gap-3 min-w-0">
                                <span
                                    className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center border-orange-500"
                                >
                                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                                </span>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-sm text-[#1E3A6E]">{opt.title}</span>
                                        {opt.badge && (
                                            <span className="text-[11px] font-medium text-orange-600 bg-orange-100 rounded-full px-2 py-0.5">
                                                {opt.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{opt.subtitle}</p>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="font-bold text-sm text-[#1E3A6E]">{opt.price}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{opt.priceNote}</p>
                            </div>
                        </button>
                    );

                })}
                <AnimatePresence>
                    {city && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className={`rounded-xl ${colorClass} p-3`}
                        >
                            {/* Message */}
                            <span className="block text-xs font-bold">
                                {message}
                            </span>

                            {/* Categories */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {FREE_CATEGORIES.map((cat) => {
                                    const count = items
                                        .filter((item) => item.category === cat)
                                        .reduce((sum, item) => sum + item.quantity, 0);

                                    const isSelected = count > 0;

                                    return (
                                        <span
                                            key={cat}
                                            className={`text-[11px] px-2.5 py-1 rounded-full transition ${isSelected
                                                ? "bg-green-100 text-green-700 border border-green-300"
                                                : "bg-white/70 text-gray-500 border border-gray-200"
                                                }`}
                                        >
                                            {cat} {isSelected && `(${count})`}
                                        </span>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <div className="flex items-center justify-between gap-3 mt-6">
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm px-4 py-2.5 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                </button>

            </div>
        </div>
    );
}