import chat from '../../../assets/images/slides-category/cat-nutrition.png'
import chien from '../../../assets/images/slides-category/chien.png'
import poisson from '../../../assets/images/slides-category/poisson.png'
import oiseau from '../../../assets/images/slides-category/oiseau.png'
import { getCategories, getFilteredProducts } from '../../../api/ClientServices'
import type { Product } from '../../../types/Clients'
import type { Categories } from '../../../types/Clients'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import truncateWords from '../../../utils/truncateWords'
import { useCart } from '../../../context/CartContext'
import VariantPickerSheet from '../../../components/clients/ProductDetails/VariantPickerSheet'
import { normalizeVariantForCart } from '../../../utils/normalizeVariant'

const promoContent: Record<string, { img: string }> = {
    chat: { img: chat },
    chien: { img: chien },
    poisson: { img: poisson },
    oiseau: { img: oiseau },
}

export default function Hero() {
    const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Categories[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const { slug, species_id, category_slug } = useParams()
    const navigate = useNavigate()
    const promo = promoContent[slug ?? ''];
    const [activeId, setActiveId] = useState<number | null>(null)
    const url = import.meta.env.VITE_API_URL
    const { addToCart } = useCart()

    const categoryScrollRef = useRef<HTMLDivElement>(null);
    const categoryRefs = useRef<Record<number, HTMLButtonElement | null>>({});

    useEffect(() => {
        if (categories.length > 0) {
            const found = categories.find(c => c.slug === category_slug);
            if (found) {
                setActiveId(found.id);
            } else {
                setActiveId(categories[0].id);
            }
        }
    }, [categories, category_slug]);

    useEffect(() => {
        setPage(1);
    }, [activeId, species_id]);

    useEffect(() => {
        const fetchCategorie = async () => {
            try {
                const res = await getCategories(slug)
                setCategories(res.data.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchCategorie();
    }, [slug])

    useEffect(() => {
        const fetchFilteredProduct = async () => {
            try {
                if (!activeId || !species_id) return;
                const res = await getFilteredProducts({
                    category_id: activeId,
                    species_id: Number(species_id),
                    page
                });
                setProducts(res.data.data.data);
                setLastPage(res.data.last_page);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFilteredProduct();
    }, [activeId, species_id, page]);

    // auto-scroll the active category chip into view (mobile horizontal scroller)
    useEffect(() => {
        if (activeId == null) return;
        const btn = categoryRefs.current[activeId];
        if (btn) {
            btn.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            });
        }
    }, [activeId, categories]);

    if (!promo) return null;

    return (
        <>
            <div className="w-full flex flex-col gap-4">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
                    <img
                        className='w-full h-[200px] sm:h-[320px] lg:h-[500px] object-cover'
                        src={promo.img}
                        alt={slug}
                    />
                </div>

                <div
                    ref={categoryScrollRef}
                    className="flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible pb-1 sm:pb-0 scrollbar-hide"
                >
                    {categories.map((ct) => {
                        const isActive = activeId === ct.id;
                        return (
                            <button
                                key={ct.id}
                                ref={(el) => { categoryRefs.current[ct.id] = el; }}
                                onClick={() => setActiveId(ct.id)}
                                className={`whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border transition-colors ${
                                    isActive
                                        ? "bg-[#FF7A45] text-white border-[#FF7A45]"
                                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#FF7A45] hover:text-[#FF7A45]"
                                }`}
                            >
                                {ct.name}
                            </button>
                        )
                    })}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-[20px] pb-4">
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

                <div className="flex justify-center sm:justify-end items-center gap-2 mb-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3.5 sm:px-4 py-1 text-xs sm:text-sm rounded-full disabled:opacity-50 bg-[#1E3A6E] text-[#FF7A45] border-0"
                    >
                        Prev
                    </button>

                    <span className="px-2 sm:px-3 text-xs">
                        Page {page}
                    </span>

                    <button
                        disabled={page === lastPage}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3.5 sm:px-4 py-1 text-xs sm:text-sm rounded-full disabled:opacity-50 bg-[#1E3A6E] text-[#FF7A45] border-0"
                    >
                        Next
                    </button>
                </div>
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