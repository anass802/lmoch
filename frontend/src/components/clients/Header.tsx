import logo from '../../assets/images/logo/lmoch.png'
import { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Menu, X, Truck, Tag, PawPrint, CalendarCheck,LifeBuoy } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getSpecies } from '../../api/ClientServices';
import type { Species } from '../../types/Clients';
import { useNavigate } from 'react-router-dom';

interface PropsHeader {
    onOpenModal: (type: 'cart' | 'search' | 'user') => void
}

const dogCatItems = [
    "Croquettes", "Friandises", "Pâtes", "Sac a dos & Cage", "Jouets",
    "Pharmacie", "Hygiène & Bain", "Fontaine & Gamelle", "Accessoires",
    "Vetements", "Coussin & niches",
]
const catOnlyItems = ["Litière & bac a litière"]
const birdFishItems = ["Nourriture", "Accessoires"]

const itemsBySlug: Record<string, string[]> = {
    "chien": dogCatItems,
    "chat": [...dogCatItems, ...catOnlyItems],
    "oiseau": birdFishItems,
    "poisson": birdFishItems,
}

function getItemsForSlug(slug: string): string[] | null {
    return itemsBySlug[slug] ?? null;
}

export default function HeaderClient({ onOpenModal }: PropsHeader) {
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const [species, setSpecies] = useState<Species[]>([]);
    const [active, setActive] = useState("accueil");
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const res = await getSpecies();
                setSpecies(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSpecies();
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const handleTabClick = (slug: string, specie_id: number) => {
        setActive(slug);
        navigate(`/categories/${slug}/${specie_id}`);
    }

    const handleMobileNavigate = (path: string, slug: string) => {
        setActive(slug);
        setMobileOpen(false);
        setMobileExpanded(null);
        navigate(path);
    }

    return (
        <div className="flex flex-col sticky top-0 z-50 bg-white"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
            {/* top banner */}
            <div className="flex gap-1.5 justify-center items-center px-3 py-2 bg-[#1E3A6E]"
                
            >
                <Truck className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="text-white text-[11px] sm:text-xs text-center leading-tight">
                    <span className="hidden sm:inline">Livraison gratuite à partir de </span>
                    <span className="sm:hidden">Livraison gratuite dès </span>
                    <span className="text-[#FF7A45]">4 articles</span>
                    <span className="hidden sm:inline"> sur Casablanca et hors Casablanca à partir de </span>
                    <span className="sm:hidden"> · </span>
                    <span className="text-[#FF7A45]">6 articles</span>
                    <span className="hidden sm:inline"></span>
                </span>
            </div>

            {/* main bar */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-b-[#E7E4DC]">
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden p-1 -ml-1 text-[#1E3A6E]"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Ouvrir le menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <img className="w-10 h-10 sm:w-13 sm:h-13" src={logo} alt="" />
                        <div className="logo-text text-[#1E3A6E] text-lg sm:text-xl">
                            <span className='text-[#FF7A45]'>Lm</span>
                            och<span className='text-[#FF7A45]'>.com</span>
                        </div>
                    </div>
                </div>

                {/* desktop nav */}
                <div className="hidden md:flex gap-6">
                    {species.map((sp) => {
                        const isActive = active === sp.slug;
                        const items = sp.categories || [];
                        const hasDropdown = items.length > 0;

                        return (
                            <div
                                key={sp.id}
                                className="relative"
                                onMouseEnter={() => hasDropdown && setOpenMenu(sp.slug)}
                                onMouseLeave={() => hasDropdown && setOpenMenu(null)}
                            >
                                <button
                                    onClick={() => handleTabClick(sp.slug, sp.id)}
                                    className={`flex items-center gap-1 py-2 font-semibold text-sm transition-colors ${isActive ? "text-[#FF7A45]" : "text-[#1A1A1A] hover:text-[#FF7A45]"}`}
                                >
                                    {sp.name}
                                    {hasDropdown && (
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === sp.slug ? "rotate-180" : ""}`} />
                                    )}
                                </button>

                                {hasDropdown && (
                                    <div
                                        className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-200 ${openMenu === sp.slug ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
                                    >
                                        <div className="bg-white rounded-2xl shadow-xl border border-[#E7E4DC] py-3 w-56 overflow-hidden">
                                            {items.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setActive(sp.slug);
                                                        setOpenMenu(null);
                                                        navigate(`/categories/${sp.slug}/${sp.id}/${cat.slug}`);
                                                    }}
                                                    className="w-full text-left px-5 py-2 text-sm text-[#4A4A4A] hover:bg-[#FFF3EC] hover:text-[#FF7A45] transition-colors"
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    <button
                        onClick={() => { setActive("promotions"); navigate('/promotions'); }}
                        className={`py-2 font-semibold text-sm transition-colors ${active === "promotions" ? "text-[#FF7A45]" : "text-[#1A1A1A] hover:text-[#FF7A45]"}`}
                    >
                        Promotions
                    </button>
                    <button
                        onClick={() => { setActive("cats"); navigate('/cats'); }}
                        className={`py-2 font-semibold text-sm transition-colors ${active === "cats" ? "text-[#FF7A45]" : "text-[#1A1A1A] hover:text-[#FF7A45]"}`}
                    >
                        Adoption & Vente
                    </button>
                    <button
                        onClick={() => { setActive("reservation"); navigate('/reservations'); }}
                        className={`py-2 font-semibold text-sm transition-colors ${active === "cats" ? "text-[#FF7A45]" : "text-[#1A1A1A] hover:text-[#FF7A45]"}`}
                    >
                        Reservation
                    </button>
                    <button
                        onClick={() => { setActive("reservation"); navigate('/support'); }}
                        className={`py-2 font-semibold text-sm transition-colors ${active === "cats" ? "text-[#FF7A45]" : "text-[#1A1A1A] hover:text-[#FF7A45]"}`}
                    >
                        Support
                    </button>

                </div>

                {/* icons */}
                <div className="flex gap-3 sm:gap-4 items-center">
                    <Search className='w-5 h-5 sm:w-6 sm:h-6 cursor-pointer' onClick={() => onOpenModal('search')} />
                    <User className='hidden sm:block w-5 h-5 sm:w-6 sm:h-6 cursor-pointer' onClick={() => navigate('auth/acount')} />
                    <div className="relative">
                        <ShoppingCart className='w-5 h-5 sm:w-6 sm:h-6 cursor-pointer' onClick={() => onOpenModal('cart')} />
                        {totalItems > 0 && (
                            <span className='absolute top-[-8px] right-[-10px] w-4 h-4 rounded-full bg-[#FF7A45] text-white text-[10px] flex items-center justify-center'>
                                {totalItems}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* mobile drawer */}
            <div
                className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                
            >
                <div
                    className="absolute inset-0 bg-black/40"
                    
                    onClick={() => setMobileOpen(false)}
                />
                <div
                    className={`absolute left-0 top-0 h-full w-[82%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
                    style={{ paddingTop: "env(safe-area-inset-top)" }}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E4DC]">
                        <div className="flex items-center gap-2">
                            <img className="w-9 h-9" src={logo} alt="" />
                            <span className="logo-text text-[#1E3A6E] text-base">
                                <span className='text-[#FF7A45]'>Lm</span>och<span className='text-[#FF7A45]'>.com</span>
                            </span>
                        </div>
                        <button onClick={() => setMobileOpen(false)} aria-label="Fermer" className="p-1 text-[#1A1A1A]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-2">
                        <button
                            onClick={() => { navigate('/auth/acount'); setMobileOpen(false); }}
                            className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-[#1A1A1A] border-b border-[#F1EFE8]"
                        >
                            <User className="w-4 h-4" /> Mon compte
                        </button>

                        {species.map((sp) => {
                            const items = sp.categories || [];
                            const hasDropdown = items.length > 0;
                            const isExpanded = mobileExpanded === sp.slug;

                            return (
                                <div key={sp.id} className="border-b border-[#F1EFE8]">
                                    <button
                                        onClick={() => {
                                            if (hasDropdown) {
                                                setMobileExpanded(isExpanded ? null : sp.slug);
                                            } else {
                                                handleMobileNavigate(`/categories/${sp.slug}/${sp.id}`, sp.slug);
                                            }
                                        }}
                                        className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold ${active === sp.slug ? "text-[#FF7A45]" : "text-[#1A1A1A]"}`}
                                    >
                                        {sp.name}
                                        {hasDropdown && (
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                        )}
                                    </button>

                                    {hasDropdown && (
                                        <div
                                            className={`overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-[1000px]" : "max-h-0"}`}
                                        >
                                            <div className="bg-[#FAFAF8] pb-2">
                                                <button
                                                    onClick={() => handleMobileNavigate(`/categories/${sp.slug}/${sp.id}`, sp.slug)}
                                                    className="w-full text-left pl-8 pr-5 py-2 text-sm text-[#FF7A45] font-medium"
                                                >
                                                    Voir tout {sp.name}
                                                </button>
                                                {items.map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => handleMobileNavigate(`/categories/${sp.slug}/${sp.id}/${cat.slug}`, sp.slug)}
                                                        className="w-full text-left pl-8 pr-5 py-2 text-sm text-[#4A4A4A]"
                                                    >
                                                        {cat.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        <button
                            onClick={() => handleMobileNavigate('/promotions', 'promotions')}
                            className={`w-full flex items-center gap-2 text-left px-5 py-3.5 text-sm font-semibold border-b border-[#F1EFE8] text-blue-500 ${active === "promotions" ? "text-[#FF7A45]" : "text-[#1A1A1A]"}`}
                        >
                            <Tag className="w-4 h-4 text-blue-600" />
                            Promotions
                        </button>
                        <button
                            onClick={() => handleMobileNavigate('/cats', 'cats')}
                            className={`w-full flex items-center gap-2  text-left px-5 py-3.5 text-sm font-semibold text-violet-500 ${active === "cats" ? "text-[#FF7A45]" : "text-[#1A1A1A]"}`}
                        >
                            <PawPrint size={20} className="text-purple-600" />
                            Adoption <span className='text-orange-500'>&</span> Vente
                        </button>
                        <button
                            onClick={() => handleMobileNavigate('/reservations', 'reservations')}
                            className={`w-full flex items-center gap-2  text-left px-5 py-3.5 text-sm font-semibold bg-gradient-to-br from-[#D9931F] to-[#FAAC2C] bg-clip-text text-transparent ${active === "reservations" ? "text-[#FF7A45]" : "text-[#1A1A1A]"}`}
                        >
                            <CalendarCheck size={20} className="text-orange-500" />
                            Reservation
                        </button>
                        <button
                            onClick={() => handleMobileNavigate('/support', 'support')}
                            className={`w-full flex items-center gap-2 text-left px-5 py-3.5 text-sm font-semibold ${active === "support" ? "text-[#FF7A45]" : "text-[#16274b]"}`}
                        >
                            <LifeBuoy size={20} className="text-[#16274b]" />
                            Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}