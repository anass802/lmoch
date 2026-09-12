import { useState, useRef, useEffect } from "react";
import { MapPin, User, Phone, Building2, Home, ChevronDown } from "lucide-react";

import type { InfoClientState } from "../../../types/Clients";
import type { MoroccoCity } from "../../../data/moroccoCities";


interface CitiesProps {
    cities: MoroccoCity[];
    onCityChange: (city: MoroccoCity | "") => void;
    form: InfoClientState;
    setForm: React.Dispatch<React.SetStateAction<InfoClientState>>;
    errors: {
        name: string;
        phone: string;
        city: string;
        address: string;
    };
}

export default function Information({ cities, onCityChange, form, setForm, errors }: CitiesProps) {
    const [saveAddress, setSaveAddress] = useState(false);

    // --- city combobox state ---
    const [cityQuery, setCityQuery] = useState(form.city || "");
    const [cityOpen, setCityOpen] = useState(false);
    const cityBoxRef = useRef<HTMLDivElement>(null);

    const filteredCities = cities.filter((c) =>
        c.toLowerCase().includes(cityQuery.trim().toLowerCase())
    );

    const selectCity = (city: MoroccoCity | "") => {
        setForm({ ...form, city });
        onCityChange(city);
        setCityQuery(city);
        setCityOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (cityBoxRef.current && !cityBoxRef.current.contains(e.target as Node)) {
                setCityOpen(false);
                // if user typed something that doesn't match a real city, revert to last valid value
                if (!cities.includes(cityQuery as MoroccoCity)) {
                    setCityQuery(form.city || "");
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [cityQuery, cities, form.city]);

    return (
        <div className="w-full p-6 border border-gray-100 rounded-2xl shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-[#1E3A6E] font-bold text-base">Adresse de livraison</h3>
            </div>

            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">Nom complet</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                className={`w-full rounded-lg border  pl-10 pr-3 py-2.5 text-sm
                                    ${errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-orange-400"}
                                    text-gray-700 focus:outline-none focus:ring-2  focus:border-transparent`}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                type="text"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">Téléphone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                className={`w-full rounded-lg border  pl-10 pr-3 py-2.5 text-sm
                                    ${errors.phone ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-orange-400"}
                                    text-gray-700 focus:outline-none focus:ring-2  focus:border-transparent`}
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                type="text"
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* --- searchable city combobox --- */}
                    <div ref={cityBoxRef} className="relative">
                        <label className="block text-sm text-gray-600 mb-1.5">Ville</label>

                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                className={`w-full rounded-lg border pl-10 pr-8 py-2.5 text-sm
                                ${errors.city ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-orange-400"}
                                text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent`}
                                placeholder="Rechercher une ville..."
                                value={cityQuery}
                                onFocus={() => setCityOpen(true)}
                                onChange={(e) => {
                                    setCityQuery(e.target.value);
                                    setCityOpen(true);
                                    if (e.target.value === "") selectCity("");
                                }}
                            />
                            <ChevronDown
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                            />

                            {cityOpen && (
                                <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                                    {filteredCities.length > 0 ? (
                                        filteredCities.map((city) => (
                                            <button
                                                type="button"
                                                key={city}
                                                onClick={() => selectCity(city)}
                                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50
                                                    ${form.city === city ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-700"}`}
                                            >
                                                {city}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-gray-400">Aucune ville trouvée</div>
                                    )}
                                </div>
                            )}
                        </div>
                        {errors.city && (
                            <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">Adresse</label>
                        <div className="relative">
                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                className={`w-full rounded-lg border  pl-10 pr-3 py-2.5 text-sm
                                    ${errors.address ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-orange-400"}
                                    text-gray-700 focus:outline-none focus:ring-2  focus:border-transparent`}
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                type="text"
                            />
                        </div>
                        {errors.address && (
                            <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                        )}
                    </div>
                </div>

                <label className="flex items-center gap-2.5 mt-1 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-orange-500 accent-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-600">
                        Enregistrer cette adresse pour mes prochaines commandes
                    </span>
                </label>
            </div>
        </div>
    );
}