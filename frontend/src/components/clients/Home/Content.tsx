import Hygiene from '../../../assets/images/icons/hygiene.png'
import Litiers from '../../../assets/images/icons/litieres.png'
import Nutrition from '../../../assets/images/icons/nutrition.png'
import Vetements from '../../../assets/images/icons/vetements.png'
import Jouets from '../../../assets/images/icons/jouets.png'
import Couchage from '../../../assets/images/icons/couchage.png'
import Transport from '../../../assets/images/icons/transport.png'
import type { Product } from '../../../types/Clients'
import truncateWords from '../../../utils/truncateWords'
import { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useCart } from '../../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import VariantPickerSheet from '../ProductDetails/VariantPickerSheet'
import { normalizeVariantForCart } from '../../../utils/normalizeVariant'


const categories = [
    { img: `${Jouets}`, label: 'Jouets',path:'/categories/chat/2/jouets-chien-chat' },
    { img: `${Hygiene}`, label: 'Hygiene', path:'/categories/chat/2/hygiene-bain-chien-chat' },
    { img: `${Litiers}`, label: 'Litière',path:'/categories/chat/2/litiere-bac-a-litiere-chat' },
    { img: `${Vetements}`, label: 'Vetements',path:'/categories/chat/2/vetements-chien-chat'},
    { img: `${Couchage}`, label: 'Transport', path:'/categories/chat/2/sac-a-dos-cage-chien-chat' },
    { img: `${Transport}`, label: 'Couchage', path:'/categories/chat/2/coussin-niches-chien-chat' },
    { img: `${Nutrition}`, label: 'Nutrition', path:'/categories/poisson/3/nourriture-poisson' },
]

interface ChatProps {
    jouetsChat: Product[]
    jouetsChien: Product[]
    randomProducts: Product[]
}

function ProductScroller({ product }: { product: Product[] }) {
    const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);
    const { addToCart } = useCart()
    const navigate = useNavigate()
    const url = import.meta.env.VITE_API_URL
    const sectionRef = useRef<HTMLDivElement>(null);

    const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps" }, [
        AutoScroll({
            speed: 0.8,
            startDelay: 0,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            playOnInit: false,
        }),
    ]);

    useEffect(() => {
        const el = sectionRef.current;
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
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [emblaApi, product]);

    return (
        <>
            <div ref={sectionRef}>
                <div ref={emblaRef} className="overflow-hidden select-none">
                    <div className="flex gap-3 sm:gap-[20px] pb-4">
                        {product.slice(0, 10).map((pt) => {
                            const hasVariants = !!pt.variants && pt.variants.length > 0;
                            const outOfStock = pt.stock === 0;
                            return (
                                <div
                                    key={pt.id}
                                    className="flex-shrink-0 w-[150px] sm:w-[220px] border border-[#1E3A6E]/10 rounded-xl p-2.5 sm:p-4 relative transition-[transform,box-shadow] duration-150 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className="flex justify-between">
                                        {pt.reduction_percent && (
                                            <span className="absolute top-2 left-2 sm:top-[14px] sm:left-[14px] rounded-xl text-[10px] sm:text-xs bg-[#1E3A6E] text-white py-1 px-2 sm:py-[5px] sm:px-[10px] font-semibold z-2">
                                                {`${pt.reduction_percent}%`}
                                            </span>
                                        )}

                                        {pt.is_promo ? (
                                            <span className='rounded-full absolute top-2 right-2 sm:top-[14px] sm:right-[14px] bg-red-500 text-white py-1 px-2 sm:py-[5px] sm:px-[10px] z-2 flex items-center justify-center font-bold text-[10px] sm:text-sm'>
                                                Promo!
                                            </span>
                                        ) : (
                                            <span></span>
                                        )}
                                    </div>

                                    <div
                                        onClick={() => navigate(`get-product-details/${pt.slug}`)}
                                        className="bg-[var(--cream)] rounded-lg sm:rounded-[12px] aspect-square flex items-center justify-center mb-2 sm:mb-[14px] overflow-hidden cursor-pointer relative"
                                    >
                                        <img
                                            src={`${url}/storage/${pt.image}`}
                                            alt={pt.name}
                                            draggable={false}
                                            className={`w-full h-full object-contain ${outOfStock ? 'opacity-50' : ''}`}
                                        />
                                        {outOfStock && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                <span className="bg-red-600 text-white  text-[9px] sm:text-xs font-semibold uppercase tracking-wide py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg shadow-md">
                                                    Rupture de stock
                                                </span>
                                            </div>
                                        )}
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
                                        disabled={outOfStock}
                                        className={`w-full font-bold text-[11px] sm:text-[13px] p-2 sm:p-[10px] rounded-lg sm:rounded-[10px] transition-colors duration-150 mt-1.5 sm:mt-2 ${outOfStock
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-[#1E3A6E]/10 text-[#1E3A6E] hover:bg-[#1E3A6E] hover:text-white'
                                            }`}
                                        onClick={() => {
                                            if (outOfStock) return;
                                            if (hasVariants) {
                                                setVariantModalProduct(pt);
                                            } else {
                                                addToCart(pt, 1, null);
                                            }
                                        }}
                                    >
                                        {outOfStock ? 'Indisponible' : 'Ajouter au panier'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
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
    );
}

export default function Content({ jouetsChat, jouetsChien, randomProducts }: ChatProps) {
    const navigate = useNavigate()
    return (
        <div className="max-w-[1480px] mx-auto px-4 sm:px-4">
            {/* Une sélection pensée pour votre compagnon */}
            <section className='section'>
                <div className="flex flex-col gap-3 sm:gap-4">
                    <h2 className='text-lg sm:text-2xl text-[#FF7A45]'>
                        <span className='text-[#1E3A6E]'>Une sélection pensée</span> pour votre compagnon
                    </h2>
                    <div className="flex gap-5 overflow-x-auto sm:overflow-visible sm:justify-between pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                        {categories.map((cat) => (
                            <div onClick={()=> navigate(cat.path)} key={cat.label} className="flex flex-col gap-1 items-center justify-center shrink-0">
                                <img className='w-14 h-14 sm:w-20 sm:h-20' src={cat.img} alt={cat.label} />
                                <span className="text-xs sm:text-base whitespace-nowrap">{cat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nos offres du moment */}
            <section className='section'>
                <div className="flex flex-col gap-4">
                    <h2 className='text-lg sm:text-2xl text-[#FF7A45] mb-5 sm:mb-10'>
                        <span className='text-[#1E3A6E]'>Nos offres</span> du moment
                    </h2>
                    <ProductScroller product={randomProducts} />
                </div>
            </section>

            {/* Jouets pour chats */}
            <section className='section'>
                <div className="flex flex-col gap-4">
                    <h2 className='text-lg sm:text-2xl text-[#FF7A45] mb-5 sm:mb-10'>
                        <span className='text-[#1E3A6E]'>Faites plaisir</span> à votre chat 🐾
                    </h2>
                    <ProductScroller product={jouetsChat} />
                </div>
            </section>

            {/* Ce que les chiens adorent le plus */}
            <section className='section'>
                <div className="flex flex-col gap-4">
                    <h2 className='text-lg sm:text-2xl text-[#FF7A45] mb-5 sm:mb-10'>
                        <span className='text-[#1E3A6E]'>Ce que les chiens</span> adorent le plus 🐾
                    </h2>
                    <ProductScroller product={jouetsChien} />
                </div>
            </section>
        </div>
    );
}