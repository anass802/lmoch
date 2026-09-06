import { useParams, Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { getProduct, getSuggestionProducts } from "../../../api/ClientServices";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { Product } from "../../../types/Clients";
import { useNavigate } from "react-router-dom";
import truncateWords from "../../../utils/truncateWords";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import ProductVariantSelector, { type Variant } from "./ProductVariantSelector";
import ProductVariantImages from "./ProductVariantImages";
import { normalizeVariantForCart } from "../../../utils/normalizeVariant";
import { useVariantSelection } from "../../../hooks/useVariantSelection";



export default function ViewProduct() {

    const BASE_URL = import.meta.env.VITE_API_URL;
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const suggestionsSectionRef = useRef<HTMLDivElement>(null);

    const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps" }, [
        AutoScroll({ speed: 0.8, startDelay: 0, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: false, direction: "forward" }),
    ]);

    const [product, setProduct] = useState<Product | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    // Stable reference: only changes when `product` itself changes, not on every render
    const productVariants = useMemo(
        () => (product?.variants ?? []) as Variant[],
        [product]
    );

    // Shared color+size selection state — replaces the old separate `activeVariant` state
    const {
        loading: variantsLoading,
        colorGroup,
        otherGroups,
        selected,
        selectValue,
        matchedVariant,
        hasVariants,
        isComplete,
    } = useVariantSelection(productVariants, product?.category_id ?? null);

    const activeVariant = matchedVariant; // derived, no separate state needed

    useEffect(() => {
        setLoading(true);
        setQty(1);
        const fetchProduct = async () => {
            try {
                const res = await getProduct(slug);
                setProduct(res.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    useEffect(() => {
        if (!product?.id || !product.category_id || !product.species_id) return;

        const product_id = product.id;
        const category_id = product.category_id;
        const species_id = product.species_id;

        const fetchSuggestionProducts = async () => {
            try {
                const res = await getSuggestionProducts({ product_id, species_id, category_id });
                setSuggestions(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchSuggestionProducts();
    }, [product?.id, product?.category_id, product?.species_id]);

    useEffect(() => {
        if (product?.image) {
            setImagePreview(`${BASE_URL}/storage/${product.image}`);
        }
    }, [product]);

    // Sync preview image whenever the matched/selected variant changes
    useEffect(() => {
        if (matchedVariant?.image_path) {
            setImagePreview(`${BASE_URL}/storage/${matchedVariant.image_path}`);
        }
    }, [matchedVariant]);

    // Re-init embla whenever the suggestions list changes (slides mount after fetch)
    useEffect(() => {
        if (emblaApi) emblaApi.reInit();
    }, [emblaApi, suggestions]);
    useEffect(() => {
        const el = suggestionsSectionRef.current;
        if (!el || !emblaApi) return;

        const autoScroll = emblaApi.plugins()?.autoScroll;
        if (!autoScroll) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    autoScroll.play();
                } else {
                    autoScroll.stop();
                }
            },
            { threshold: 0.3 } // fires once ~30% of the section is visible
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [emblaApi, suggestions]);

    const inStock = (product?.stock ?? 0) > 0;
    const maxQty = Math.min(product?.stock ?? 1, 10);

    const handleAdd = () => {
        if (!product || !inStock) return;
        if (hasVariants && !isComplete) return; // block: size/color not fully chosen
        addToCart(product, qty, normalizeVariantForCart(activeVariant));
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    const goToProduct = useCallback(
        (slug: string) => navigate(`/get-product-details/${slug}`),
        [navigate]
    );

    if (loading) {
        return (
            <div className="max-w-[1480px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
                <div className="aspect-square rounded-3xl bg-[#F3EEE4]" />
                <div className="flex flex-col gap-4 pt-4">
                    <div className="h-4 w-24 bg-[#F3EEE4] rounded-full" />
                    <div className="h-8 w-3/4 bg-[#F3EEE4] rounded-lg" />
                    <div className="h-6 w-1/3 bg-[#F3EEE4] rounded-lg" />
                    <div className="h-32 w-full bg-[#F3EEE4] rounded-lg" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-[1480px] mx-auto px-4 py-24 text-center">
                <span className="text-5xl">🐾</span>
                <p className="mt-4 text-lg font-semibold text-[#1E3A6E]">
                    Ce produit est introuvable.
                </p>
                <Link
                    to="/"
                    className="inline-block mt-4 text-sm font-medium text-[#E07A3F] hover:underline"
                >
                    Retour à la boutique
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1480px] mx-auto px-4 py-6 md:py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[#7A7268] mb-6">
                <Link to="/" className="hover:text-[#1E3A6E] transition-colors">
                    Accueil
                </Link>
                <span>/</span>
                {product.category?.name && (
                    <>
                        <span className="hover:text-[#1E3A6E]">{product.category.name}</span>
                        <span>/</span>
                    </>
                )}
                <span className="text-[#1E3A6E] font-medium truncate max-w-[200px]">
                    {product.name}
                </span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* Image */}
                <div className="relative group flex flex-col ">
                    <div className="w-full">
                        <div className="absolute -inset-3 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,#F6E9D8_0%,transparent_60%)] -z-10" />
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#FAF7F1] ring-1 ring-[#EFE7D8] shadow-[0_20px_50px_-20px_rgba(30,58,110,0.25)]">
                            {imagePreview && (
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={imagePreview}
                                    alt={product.name}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder-pet.png";
                                    }}
                                />
                            )}
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.is_promo && product.reduction_percent ? (
                                    <span className="px-3 py-1 rounded-full bg-[#E07A3F] text-white text-xs font-bold shadow-md">
                                        -{product.reduction_percent}%
                                    </span>
                                ) : null}
                                {product.is_best && (
                                    <span className="px-3 py-1 rounded-full bg-[#1E3A6E] text-white text-xs font-bold shadow-md flex items-center gap-1">
                                        ★ Best-seller
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <ProductVariantImages
                        variants={productVariants}
                        colorGroup={colorGroup}
                        selectedColorValueId={colorGroup ? selected[colorGroup.type.id] ?? null : null}
                        onSelectColor={selectValue}
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-5 md:pt-2">
                    {product.category?.name && (
                        <span className="w-fit text-xs font-semibold tracking-wide uppercase text-white bg-orange-500 px-3 py-1 rounded-full">
                            {product.category.name}
                        </span>
                    )}

                    <h3 className=" md:text-[2.1rem] leading-tight font-bold text-[#1E3A6E]">
                        {product.name}
                    </h3>
                    {/* Price */}
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-extrabold text-[#1E3A6E]">
                            {product.price} <span className="text-orange-500 text-xl">Dhs</span>
                        </span>
                        {product.old_price && product.old_price > product.price && (
                            <span className="text-base text-[#B0A895] line-through mb-1">
                                {product.old_price} DH
                            </span>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2 text-sm">
                        <span
                            className={`w-2 h-2 rounded-full ${inStock ? "bg-[#4CAF71]" : "bg-[#E05C5C]"
                                }`}
                        />
                        <span className={inStock ? "text-[#4CAF71]" : "text-[#E05C5C]"}>
                            {inStock ? `En stock (${product.stock})` : "Rupture de stock"}
                        </span>
                    </div>

                    {product.description && (
                        <p className="text-[#5C5548] leading-relaxed text-sm">
                            {product.description}
                        </p>
                    )}

                    {otherGroups.length > 0 && (
                        <ProductVariantSelector
                            groups={otherGroups}
                            selected={selected}
                            onSelect={selectValue}
                            loading={variantsLoading}
                        />
                    )}

                    {/* Divider */}
                    <div className="h-px w-full bg-[#EFE7D8]" />

                    {/* Qty + Add to cart */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-[#EFE7D8] rounded-full overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                disabled={!inStock}
                                className="w-10 h-10 flex items-center justify-center text-[#1E3A6E] hover:bg-[#FAF7F1] disabled:opacity-40"
                            >
                                −
                            </button>
                            <span className="w-10 text-center font-semibold text-[#1E3A6E]">
                                {qty}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                                disabled={!inStock}
                                className="w-10 h-10 flex items-center justify-center text-[#1E3A6E] hover:bg-[#FAF7F1] disabled:opacity-40"
                            >
                                +
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!inStock || (hasVariants && !isComplete)}
                            className={`flex-1 h-12 rounded-full font-semibold text-white transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(30,58,110,0.5)] ${!inStock || (hasVariants && !isComplete)
                                ? "bg-[#D8D2C4] cursor-not-allowed shadow-none"
                                : added
                                    ? "bg-[#4CAF71]"
                                    : "bg-[#1E3A6E] hover:bg-[#E07A3F]"
                                }`}
                        >
                            {!inStock
                                ? "Indisponible"
                                : hasVariants && !isComplete
                                    ? "Choisissez une option"
                                    : added
                                        ? "Ajouté ✓"
                                        : "Ajouter au panier"}
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-3 pt-4">
                        {[
                            { icon: "🚚", label: "Livraison rapide" },
                            { icon: "📦", label: "Click & Collect" },
                            { icon: "🛡️", label: "Paiement à la livraison" },
                        ].map((b) => (
                            <div
                                key={b.label}
                                className="flex flex-col items-center text-center gap-1 rounded-2xl bg-[#FAF7F1] py-3 px-2"
                            >
                                <span className="text-lg">{b.icon}</span>
                                <span className="text-[11px] text-[#7A7268] leading-tight">
                                    {b.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Suggestions carousel (Embla) */}
            {suggestions.length > 0 && (
                <div className="mt-8 flex flex-col" ref={suggestionsSectionRef}>
                    <h2 className="text-[#1E3A6E]">Suggestion Produits</h2>

                    <div className="overflow-hidden select-none" ref={emblaRef}>
                        <div className="flex gap-[20px] pb-4">
                            {suggestions.slice(0, 20).map((sg) => (
                                <div
                                    key={sg.id}
                                    className="flex-shrink-0 w-[220px] border border-[#1E3A6E]/10 rounded-xl p-4 relative transition-[transform,box-shadow] duration-150 hover:shadow-lg hover:-translate-y-1"
                                >
                                    {sg.is_promo && sg.reduction_percent ? (
                                        <span className="absolute top-[14px] left-[14px] rounded-xl text-xs bg-[#1E3A6E] text-white py-[5px] px-[10px] font-semibold z-10">
                                            -{sg.reduction_percent}%
                                        </span>
                                    ) : null}

                                    <div
                                        onClick={() => goToProduct(sg.slug)}
                                        className="bg-[var(--cream)] rounded-[12px] aspect-square flex items-center justify-center mb-[14px] overflow-hidden cursor-pointer"
                                    >
                                        <img src={`${BASE_URL}/storage/${sg.image}`} alt={sg.name} draggable={false} />
                                    </div>

                                    <p className="text-sm text-[#1E3A6E] font-semibold leading-[1.4] mb-2 min-h-[38px]">
                                        {truncateWords(sg.name)}
                                    </p>

                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-[17px] font-bold text-[#FF7A45]">{sg.price} MAD</span>
                                        {sg.old_price && sg.old_price > sg.price && (
                                            <span className="text-[13px] text-[var(--muted)] line-through">
                                                {sg.old_price} MAD
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => addToCart(sg, 1)}
                                        className="w-full bg-[#1E3A6E]/10 text-[#1E3A6E] hover:bg-[#1E3A6E] hover:text-white font-bold text-[13px] p-[10px] rounded-[10px] transition-colors duration-150 mt-2"
                                    >
                                        Ajouter au panier
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}