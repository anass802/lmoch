import type { Species } from "../../../types/Clients";
import { getSpecies } from "../../../api/ClientServices";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Dog, Cat, Bird, Fish, Utensils, Droplet,
    Gamepad2, BedDouble, Truck, PawPrint
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
    "chiens": Dog,
    "chats": Cat,
    "oiseaux": Bird,
    "poissons": Fish,
    "alimentation": Utensils,
    "hygiène": Droplet,
    "hygiene": Droplet,
    "jouets": Gamepad2,
    "couchage": BedDouble,
    "transport": Truck,
}

function getIcon(name: string) {
    const Icon = iconMap[name.toLowerCase()] ?? PawPrint;
    return Icon;
}

export function SideBar() {
    const [species, setSpecies] = useState<Species[]>([]);
    const { slug } = useParams();
    const navigate = useNavigate();

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

    return (
        <div className="w-full lg:w-64 flex flex-col gap-3 sm:gap-4 lg:sticky lg:top-34 lg:h-fit">
            {/* Categories — horizontal scroll chips on mobile, vertical list on desktop */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="hidden lg:block p-4 border-b border-gray-100">
                    <h3 className="text-[16px] font-semibold text-gray-900">
                        Toutes les catégories
                    </h3>
                </div>

                <div className="flex lg:flex-col gap-1 p-2 overflow-x-auto lg:overflow-x-visible lg:max-h-[60vh] lg:overflow-y-auto scrollbar-hide">
                    {species.map((sp) => {
                        const Icon = getIcon(sp.name);
                        const isActive = slug === sp.slug;

                        return (
                            <button
                                key={sp.id}
                                onClick={() => navigate(`/categories/${sp.slug}/${sp.id}`)}
                                className={`flex items-center gap-2 lg:gap-3 px-3.5 lg:px-4 py-2 lg:py-2.5 rounded-full lg:rounded-xl text-xs lg:text-sm font-medium transition-all shrink-0 whitespace-nowrap ${
                                    isActive
                                        ? "bg-[#0B2C6B] text-white shadow"
                                        : "text-gray-600 bg-gray-50 lg:bg-transparent hover:bg-gray-100 lg:hover:bg-gray-50"
                                }`}
                            >
                                <Icon
                                    className={`w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0 ${
                                        isActive ? "text-white" : "text-gray-400"
                                    }`}
                                />
                                {sp.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Promo card — hidden on mobile, only shown from lg up */}
            <div className="hidden lg:block bg-[#EAF0FF] rounded-2xl p-5 relative overflow-hidden shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-1 leading-snug">
                    Offrez le meilleur<br />à vos compagnons
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                    Découvrez nos produits sélectionnés avec amour
                </p>
                <button className="bg-[#0B2C6B] text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-[#0a2557] transition-colors">
                    Découvrir
                </button>
            </div>
        </div>
    );
}