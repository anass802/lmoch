import { useEffect, useState } from "react";
import { getCatListingsAdmin, deleteCatListing } from "../api/Adminservice";
import CatListingModal from "../components/Models/CatListing";
import type { CatListing } from "../types/Cats";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function CatListingsPage() {
    const [cats, setCats] = useState<CatListing[]>([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalCat, setModalCat] = useState<CatListing | null | undefined>(undefined);
    const [deleting, setDeleting] = useState<number | null>(null);

    const load = async (page = 1) => {
        setLoading(true);
        try {
            const res = await getCatListingsAdmin(page, search ? { search } : {});
            setCats(res.data.data.data);
            setPagination({
                current_page: res.data.data.current_page,
                last_page: res.data.data.last_page,
                total: res.data.data.total,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleDelete = async (id: number) => {
        if (!confirm("Supprimer ce chat ?")) return;
        setDeleting(id);
        try {
            await deleteCatListing(id);
            setCats((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-5 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Chats (vente / adoption)</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{pagination.total} annonces</p>
                </div>
                <button
                    onClick={() => setModalCat(null)}
                    className="flex items-center gap-2 px-4.5 py-3.5 bg-gradient-to-r from-orange-600 to-orange-400 hover:opacity-90 text-white text-sm font-medium rounded-full transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter un chat
                </button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
                    placeholder="Rechercher un chat..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <th className="text-left px-4 py-3">Photo</th>
                            <th className="text-left px-4 py-3">Nom</th>
                            <th className="text-left px-4 py-3">Type</th>
                            <th className="text-left px-4 py-3">Statut</th>
                            <th className="text-left px-4 py-3">Prix</th>
                            <th className="text-left px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-8 text-gray-400">Chargement...</td></tr>
                        ) : cats.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8 text-gray-400">Aucun chat trouvé.</td></tr>
                        ) : (
                            cats.map((cat) => (
                                <tr key={cat.id} className="border-t border-gray-100">
                                    <td className="px-4 py-3">
                                        <img
                                            src={cat.image ? `${BASE_URL}/storage/${cat.image}` : "/placeholder-cat.png"}
                                            className="w-10 h-10 rounded-lg object-cover"
                                            alt={cat.name}
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-700">{cat.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            cat.listing_type === "adoption" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-700"
                                        }`}>
                                            {cat.listing_type === "adoption" ? "Adoption" : "Vente"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 capitalize">{cat.status}</td>
                                    <td className="px-4 py-3 text-gray-700">{cat.price ? `${cat.price} Dhs` : "—"}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setModalCat(cat)} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                disabled={deleting === cat.id}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center gap-2">
                {Array.from({ length: pagination.last_page }, (_, i) => {
                    const page = i + 1;
                    return (
                        <button
                            key={page}
                            onClick={() => load(page)}
                            className={`px-3 py-1.5 rounded-lg text-sm ${
                                page === pagination.current_page ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-orange-100"
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {modalCat !== undefined && (
                <CatListingModal cat={modalCat} onClose={() => setModalCat(undefined)} onSaved={() => load(pagination.current_page)} />
            )}
        </div>
    );
}