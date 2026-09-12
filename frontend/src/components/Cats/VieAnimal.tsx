import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAnimal } from "../../api/ClientServices";
import type { CatListing } from "../../types/Cats";

const NAVY = "#1E3A6E";
const ORANGE = "#E07A3F";
const CREAM = "#FAF7F1";
const CREAM_SOFT = "#F3EEE4";
const LINE = "#EFE7D8";
const TEXT_MUTE = "#7A7268";
const TEXT_BODY = "#5C5548";

export default function ViewAnimal() {
    const BASE_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();

    const [Animal, setAnimal] = useState<CatListing | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const res = await getAnimal(id as unknown as number);
                setAnimal(res.data.data);
                setImagePreview(`${BASE_URL}/storage/${res.data.data.image}`);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnimal();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-[1480px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
                <div className="aspect-square rounded-3xl" style={{ backgroundColor: CREAM_SOFT }} />
                <div className="flex flex-col gap-4 pt-4">
                    <div className="h-4 w-24 rounded-full" style={{ backgroundColor: CREAM_SOFT }} />
                    <div className="h-8 w-3/4 rounded-lg" style={{ backgroundColor: CREAM_SOFT }} />
                    <div className="h-6 w-1/3 rounded-lg" style={{ backgroundColor: CREAM_SOFT }} />
                    <div className="h-32 w-full rounded-lg" style={{ backgroundColor: CREAM_SOFT }} />
                </div>
            </div>
        );
    }

    if (!Animal) {
        return (
            <div className="max-w-[1480px] mx-auto px-4 py-24 text-center">
                <span className="text-5xl">🐾</span>
                <p className="mt-4 text-lg font-semibold" style={{ color: NAVY }}>
                    Cet animal est introuvable.
                </p>
                <Link
                    to="/"
                    className="inline-block mt-4 text-sm font-medium hover:underline"
                    style={{ color: ORANGE }}
                >
                    Retour à la boutique
                </Link>
            </div>
        );
    }

    const isForSale = Animal.listing_type === "vente" && Animal.status === "disponible";

    const specs = [
        { label: "Couleur", value: Animal.color, icon: "🎨" },
        { label: "Âge", value: `${Animal.age_months} mois`, icon: "🎂" },
        { label: "Ville", value: Animal.city, icon: "📍" },
        { label: "Race", value: Animal.breed, icon: "🐾" },
        { label: "Genre", value: Animal.gender, icon: "⚥" },
    ].filter((s) => s.value);

    return (
        <div className="max-w-[1480px] mx-auto px-4 py-6 md:py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: TEXT_MUTE }}>
                <Link to="/" className="transition-colors hover:opacity-80" style={{ color: TEXT_MUTE }}>
                    Accueil
                </Link>
                <span>/</span>
                {Animal.breed && (
                    <>
                        <span>{Animal.breed}</span>
                        <span>/</span>
                    </>
                )}
                <span className="font-medium truncate max-w-[200px]" style={{ color: NAVY }}>
                    {Animal.name}
                </span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* Image */}
                <div className="relative group">
                    <div
                        className="absolute -inset-3 rounded-[2rem] -z-10"
                        style={{
                            background:
                                "radial-gradient(circle at 30% 20%, #F6E9D8 0%, transparent 60%)",
                        }}
                    />
                    <div
                        className="relative aspect-square rounded-3xl overflow-hidden"
                        style={{
                            backgroundColor: CREAM,
                            boxShadow: "0 20px 50px -20px rgba(30,58,110,0.25)",
                            outline: `1px solid ${LINE}`,
                        }}
                    >
                        {imagePreview && (
                            <img
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                src={imagePreview}
                                alt={Animal.name}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder-pet.png";
                                }}
                            />
                        )}
                        {isForSale && (
                            <div className="absolute top-4 left-4">
                                <span
                                    className="px-3 py-1 rounded-full text-white text-xs font-semibold shadow-md"
                                    style={{ backgroundColor: ORANGE }}
                                >
                                    En vente
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-6 md:pt-2">
                    <div className="flex flex-col gap-3">
                        {Animal.breed && (
                            <span
                                className="w-fit text-xs font-semibold text-white px-3 py-1 rounded-full"
                                style={{ backgroundColor: ORANGE }}
                            >
                                {Animal.breed}
                            </span>
                        )}

                        <h1
                            className="text-3xl md:text-[2.4rem] leading-tight font-bold"
                            style={{ color: NAVY }}
                        >
                            {Animal.name}
                        </h1>

                        <div className="flex items-baseline gap-2">
                            {isForSale ? (
                                <>
                                    <span className="text-3xl font-extrabold" style={{ color: NAVY }}>
                                        {Animal.price}
                                    </span>
                                    <span className="text-lg font-semibold" style={{ color: ORANGE }}>
                                        Dhs
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold" style={{ color: NAVY }}>
                                    {Animal.listing_type === "adoption" ? "Disponible à l'adoption" : "Non disponible"}
                                </span>
                            )}
                        </div>
                    </div>

                    {Animal.description && (
                        <p className="leading-relaxed text-[15px]" style={{ color: TEXT_BODY }}>
                            {Animal.description}
                        </p>
                    )}

                    <div className="h-px w-full" style={{ backgroundColor: LINE }} />

                    {/* Specs */}
                    <dl className="grid grid-cols-2 gap-3">
                        {specs.map((s) => (
                            <div
                                key={s.label}
                                className="rounded-2xl px-4 py-3 flex items-start gap-3"
                                style={{ backgroundColor: CREAM }}
                            >
                                <span className="text-lg leading-none">{s.icon}</span>
                                <div className="flex flex-col">
                                    <dt className="text-xs" style={{ color: TEXT_MUTE }}>
                                        {s.label}
                                    </dt>
                                    <dd className="text-sm font-semibold" style={{ color: NAVY }}>
                                        {s.value}
                                    </dd>
                                </div>
                            </div>
                        ))}
                    </dl>

                    <div className="h-px w-full" style={{ backgroundColor: LINE }} />

                    {/* Owner / contact */}
                    <div
                        className="rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        style={{ backgroundColor: CREAM }}
                    >
                        <div className="flex flex-col">
                            <span className="text-xs" style={{ color: TEXT_MUTE }}>
                                Responsable
                            </span>
                            <span className="text-sm font-semibold" style={{ color: NAVY }}>
                                {Animal.owner_name}
                            </span>
                        </div>
                        <a
                            href={`tel:${Animal.owner_phone}`}
                            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: ORANGE }}
                        >
                            📞 {Animal.owner_phone}
                        </a>
                    </div>

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-3 pt-1">
                        {[
                            { icon: "🚚", label: "Livraison rapide" },
                            { icon: "📦", label: "Click & Collect" },
                            { icon: "🛡️", label: "Paiement à la livraison" },
                        ].map((b) => (
                            <div
                                key={b.label}
                                className="flex flex-col items-center text-center gap-1 rounded-2xl py-3 px-2"
                                style={{ backgroundColor: CREAM }}
                            >
                                <span className="text-lg">{b.icon}</span>
                                <span className="text-[11px] leading-tight" style={{ color: TEXT_MUTE }}>
                                    {b.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}