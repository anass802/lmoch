import { useState } from "react";
import { MapPin, User, Phone, Building2, Home } from "lucide-react";

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
    //     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setForm({ ...form, [e.target.name]: e.target.value });
    //   };

    const [saveAddress, setSaveAddress] = useState(false);

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
                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">Ville</label>

                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            <select
                                className={`w-full appearance-none rounded-lg border pl-10 pr-8 py-2.5 text-sm leading-tight
            ${errors.city ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-orange-400"}
            text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent`}
                                value={form.city}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const city = value === "" ? "" : (value as MoroccoCity);
                                    setForm({ ...form, city });
                                    onCityChange(city);
                                }}
                            >
                                <option value="">Sélectionnez une ville</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
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