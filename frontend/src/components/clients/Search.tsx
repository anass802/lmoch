import { useEffect, useState } from "react";
import { Search, TrendingUp, Sparkles, Heart } from "lucide-react"
import type { Product } from "../../types/Clients";
import { getSearch } from "../../api/ClientServices";
import truncateWords from "../../utils/truncateWords";
import { useNavigate } from "react-router-dom";

import { getRandomProducts } from "../../api/ClientServices";

interface PropsSearch {
    onClose: () => void
}

const popularSearches = [
    "Croquettes chat",
    "Litière pour chat",
    "Jouets pour chien",
    "Panier pour chien",
    "Arbre à chat",
    "Trendycat",
    "Friandises naturelles",
]

const categories = [
    { label: "Chiens", emoji: "🐕",path:'categories/chien/1' },
    { label: "Chats", emoji: "🐈",path:'categories/chat/2' },
    { label: "Oiseaux", emoji: "🦜",path:'categories/oiseau/3' },
    { label: "Poissons", emoji: "🐟",path:'categories/poisson/4' },
    { label: "Jouets & Accessoires", emoji: "🎾",path:'categories/oiseau/4' },
    { label: "Hygiène", emoji: "🧴",path:'categories/oiseau/4' },
]



export default function SearchBox({ onClose }: PropsSearch) {
    const url = import.meta.env.VITE_API_URL
    const navigate=useNavigate()
    const texts = ["Rechercher un produit, une jouet...", "Rechercher une marque, un accessoire...", "Rechercher une catégorie, une marque..."];
    const [placeholder, setPlaceholder] = useState("");
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [search, setSearch] = useState('')
    const [products, setProducts] = useState<Product[]>([])
    const mid = Math.ceil(products.length / 2);
    const leftProducts = products.slice(0, mid);
    const rightProducts = products.slice(mid);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    useEffect(()=>{
        const fetchSuggestions=async()=>{
            try{
                const res= await getRandomProducts();
                setSuggestions((res.data.data ?? []).slice(0,4))
            }catch(err){
                console.error(err)
            }
        }
        fetchSuggestions()
    },[])

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getSearch(search)
                setProducts(res.data.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchProduct()
    }, [search])

    useEffect(() => {
        const currentText = texts[index];

        if (charIndex < currentText.length) {
            const timeout = setTimeout(() => {
                setPlaceholder(prev => prev + currentText[charIndex]);
                setCharIndex(prev => prev + 1);
            }, 50);

            return () => clearTimeout(timeout);
        } else {
            setTimeout(() => {
                setPlaceholder("");
                setCharIndex(0);
                setIndex((prev) => (prev + 1) % texts.length);
            }, 1500);
        }
    }, [charIndex, index]);

    const isEmpty = search.trim() === "";

    return (
        <div className="fixed inset-0 z-[999] flex justify-center bg-black/50 backdrop-blur-sm px-4 overflow-y-auto py-10">
            <div className="flex flex-col w-full max-w-4xl h-fit">
                {/* Search bar */}
                <div className="relative w-full mt-10 h-fit">
                    <div className="relative flex items-center">
                        <Search className="w-5 h-5 absolute left-4 text-gray-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-32 py-4 bg-white rounded-full outline-none focus:ring-2 focus:ring-orange-300"
                            placeholder={placeholder}
                            autoFocus
                        />
                        <button
                            onClick={onClose}
                            className="absolute text-white font-semibold right-1 text-sm p-4
                            rounded-full transition rounded-r-3xl rounded-l-xl bg-orange-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Results panel */}
                <div className="bg-white rounded-3xl mt-4 shadow-xl flex flex-col  max-h-[500px]">
                    {isEmpty ? (
                        <div className="bg-white rounded-3xl mt-4 shadow-xl flex flex-col max-h-[500px]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-8 overflow-y-auto flex-1">
                                {/* Recherches populaires */}
                                <div>
                                    <h4 className="text-gray-900 mb-4 w-full text-center text-[20px]">Recherches populaires</h4>
                                    <ul className="space-y-3">
                                        {popularSearches.map((term) => (
                                            <li key={term}>
                                                <button
                                                    onClick={() => setSearch(term)}
                                                    className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition text-sm"
                                                >
                                                    <TrendingUp className="w-4 h-4 text-orange-400" />
                                                    {term}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Catégories */}
                                <div className="md:border-l md:border-gray-400 md:pl-8">
                                    <h4 className="text-[20px] w-full text-center text-gray-900 mb-4">Catégories</h4>
                                    <ul className="space-y-3">
                                        {categories.map((cat) => (
                                            <li key={cat.label}>
                                                <button onClick={()=>{navigate(cat.path);onClose()}}
                                                className="flex items-center gap-3 text-gray-700 hover:text-orange-500 transition text-sm w-full">
                                                    <span className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-50 text-lg">
                                                        {cat.emoji}
                                                    </span>
                                                    {cat.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Suggestions pour vous */}
                                <div className="md:border-l md:border-gray-400 md:pl-8">
                                    <h4 className="text-[20px] w-full text-center text-gray-900 mb-4">Suggestions pour vous</h4>
                                    <ul className="space-y-4">
                                        {suggestions.map((item) => (
                                            <li key={item.name}>
                                                <button 
                                                onClick={()=>{navigate(`/get-product-details/${item.slug}`);onClose()}}
                                                className="flex items-center gap-3 text-left w-full group">
                                                    <img
                                                        src={`${url}/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-500 transition truncate">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400 truncate">{item.description}</p>
                                                        <p className="text-sm font-bold text-orange-500 mt-0.5">
                                                            {item.price}
                                                        </p>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                    ) : (
                        // ---- Bloc affiché UNIQUEMENT quand l'utilisateur tape ----
                        <div className="bg-white rounded-3xl mt-4 shadow-xl flex flex-col min-h-[200px] max-h-[500px]">
                            <div className="px-8 py-8 overflow-y-auto flex-1">

                                {products.length === 0 ? (
                                    // ---- ÉTAT VIDE : aucun résultat ----
                                    <div>
                                        <div className="flex flex-col items-center text-center pb-6">
                                            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                                                <Search className="w-6 h-6 text-orange-500" />
                                            </div>
                                            <p className="font-semibold text-gray-900 mb-1">
                                                Aucun résultat pour « {search} »
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Essayez un autre mot-clé ou explorez ces suggestions.
                                            </p>
                                        </div>

                                        <div className="border-t border-gray-200 pt-5">
                                            <p className="text-sm font-semibold text-gray-600 mb-3">Vous pourriez aussi aimer</p>
                                            <div className="grid grid-cols-3 gap-3">
                                                {suggestions.map((item) => (
                                                    <button
                                                        onClick={()=>{navigate(`/get-product-details/${item.slug}`);onClose()}}
                                                        key={item.name}
                                                        className="flex flex-col items-start gap-1.5 p-2.5 text-left bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 transition"
                                                    >
                                                        <img src={`${url}/storage/${item.image}`} alt={item.name} className="w-full aspect-square object-cover rounded-lg" />
                                                        <span className="text-xs font-medium text-gray-900 truncate w-full">{item.name}</span>
                                                        <span className="text-xs font-semibold text-orange-500">{item.price}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 mt-5 pt-4">
                                            <p className="text-sm font-semibold text-gray-600 mb-2.5">Recherches populaires</p>
                                            <div className="flex flex-wrap gap-2">
                                                {popularSearches.map((term) => (
                                                    <button
                                                        key={term}
                                                        onClick={() => setSearch(term)}
                                                        className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:border-orange-300 hover:text-orange-500 transition"
                                                    >
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // ---- RÉSULTATS ----
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                        {/* LEFT COLUMN */}
                                        <div className="flex flex-col gap-4">
                                            {leftProducts.map((product) => (
                                                <div onClick={()=>{navigate(`/get-product-details/${product.slug}`);onClose()}}  key={product.id} className="flex gap-4 cursor-pointer">
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden">
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={`${url}/storage/${product.image}`}
                                                            alt={product.name}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm hover:text-[#82777c] text-[#1E3A6E]">
                                                            {truncateWords(product.name)}
                                                        </span>
                                                        
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-semibold text-[#1E3A6E]">{product.price} <span className="font-bold text-orange-500">Dhs</span></span>
                                                            <span className="text-xs font-semibold text-[#1E3A6E]">{product.stock} <span className="text-green-500 text-sm">Qnt</span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* RIGHT COLUMN - seulement si des produits y sont assignés */}
                                        {rightProducts.length > 0 && (
                                            <div className="flex flex-col gap-4 md:border-l md:border-gray-300 md:pl-8">
                                                {rightProducts.map((product) => (
                                                    <div onClick={()=>{navigate(`/get-product-details/${product.slug}`);onClose()}} key={product.id} className="flex gap-4 cursor-pointer">
                                                        <div className="w-20 h-20 rounded-xl overflow-hidden">
                                                            <img
                                                                className="w-full h-full object-cover"
                                                                src={`${url}/storage/${product.image}`}
                                                                alt={product.name}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm hover:text-[#82777c]">
                                                                {truncateWords(product.name)}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {product.category?.name}
                                                            </span>
                                                            <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-semibold text-[#1E3A6E]">{product.price} <span className="font-bold text-orange-500">Dhs</span></span>
                                                            <span className="text-xs text-[#1E3A6E] font-semibold">{product.stock} <span className="text-green-500 text-sm">Qnt</span></span>
                                                        </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer banner */}
                    <div className="bg-orange-50/70 px-8 py-4 rounded-b-3xl flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <span>Des milliers de produits pour le bonheur de vos compagnons</span>
                        <Heart className="w-4 h-4 text-orange-300" />
                    </div>
                </div>
            </div>
        </div>
    )
}