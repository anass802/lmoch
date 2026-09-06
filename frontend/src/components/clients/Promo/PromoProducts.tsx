import { useState, useEffect } from "react";
import { getPromoProducts } from "../../../api/ClientServices";
import type { Product } from "../../../types/Clients";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import truncateWords from "../../../utils/truncateWords";
import VariantPickerSheet from "../ProductDetails/VariantPickerSheet";
import { normalizeVariantForCart } from "../../../utils/normalizeVariant";

export default function PromoProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const url = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchPromoProducts = async () => {
            try {
                const res = await getPromoProducts();
                setProducts(res.data.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPromoProducts();
    }, []);

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-[20px] pb-4 mt-4 sm:mt-6 max-w-[1280px] mx-auto px-3 sm:px-4">
                {products.map((pt) => {
                    const hasVariants = !!pt.variants && pt.variants.length > 0;
                    return (
                        <div
                            key={pt.id}
                            className="border border-[#1E3A6E]/10 rounded-xl p-2.5 sm:p-4 relative transition-[transform,box-shadow] duration-150 hover:shadow-lg hover:-translate-y-1"
                        >
                            {pt.reduction_percent && (
                                <span className="absolute top-2 left-2 sm:top-[14px] sm:left-[14px] rounded-xl text-[10px] sm:text-xs bg-[#1E3A6E] text-white py-1 px-2 sm:py-[5px] sm:px-[10px] font-semibold z-2">
                                    {`${pt.reduction_percent}%`}
                                </span>
                            )}
                            {pt.is_promo && (
                                <span className='rounded-full absolute top-2 right-2 sm:top-[14px] sm:right-[14px] bg-red-500 text-white py-1 px-2 sm:py-[5px] sm:px-[10px] z-2 flex items-center justify-center font-bold text-[10px] sm:text-sm'>
                                    Promo!
                                </span>
                            )}
                            <div
                                onClick={() => navigate(`/get-product-details/${pt.slug}`)}
                                className="bg-[var(--cream)] rounded-lg sm:rounded-[12px] aspect-square flex items-center justify-center mb-2 sm:mb-[14px] overflow-hidden cursor-pointer"
                            >
                                <img src={`${url}/storage/${pt.image}`} alt={pt.name} draggable={false} className="w-full h-full object-contain" />
                            </div>
                            <p className="text-xs sm:text-sm text-[#1E3A6E] font-semibold leading-[1.4] mb-1.5 sm:mb-2 min-h-[32px] sm:min-h-[38px]">
                                {truncateWords(pt.name)}
                            </p>
                            <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                                <span className="text-sm sm:text-[17px] font-bold text-[#FF7A45]">
                                    {pt.price} MAD
                                </span>
                                <span className="text-[11px] sm:text-[13px] text-[var(--muted)] line-through">
                                    {pt.old_price ? `${pt.old_price} MAD` : null}
                                </span>
                            </div>
                            <button
                                className="w-full bg-[#1E3A6E]/10 text-[#1E3A6E] hover:bg-[#1E3A6E] hover:text-white font-bold text-[11px] sm:text-[13px] p-2 sm:p-[10px] rounded-lg sm:rounded-[10px] transition-colors duration-150 mt-1.5 sm:mt-2"
                                onClick={() => {
                                    if (hasVariants) {
                                        setVariantModalProduct(pt);
                                    } else {
                                        addToCart(pt, 1, null);
                                    }
                                }}
                            >
                                Ajouter au panier
                            </button>
                        </div>
                    )
                })}
            </div>
            {variantModalProduct && (
                <VariantPickerSheet
                    product={variantModalProduct}
                    onClose={() => setVariantModalProduct(null)}
                    onConfirm={(variant) => {
                        addToCart(variantModalProduct, 1, normalizeVariantForCart(variant));
                        setVariantModalProduct(null);
                    }}
                />
            )}
        </>
    )
}