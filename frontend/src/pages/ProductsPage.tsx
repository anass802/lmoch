import { useEffect, useState } from "react";
import { getProducts, deleteProduct, getCategories, getUncategorizedProducts, getSpecies } from "../api/Adminservice";
import type { Species } from "../types/admin";
import ProductModal from "../components/Models/Product";
import type { Product, Category } from "../types/Clients";
import { Plus, Search } from "lucide-react";
import ProductsTable from "../components/Dashboard/Products/ProductsTable";
import UncategorizedProductsPanel from "../components/Dashboard/Products/UncategorizedProductsPanel";

export default function ProductsPage() {

    const [products, setProducts] = useState<Product[]>([]);
    const [paginationP, setPaginationP] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });
    const [paginationC, setPaginationC] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [species, setSpecies] = useState<Species[]>([]);
    const [uncategorized, setUncategorized] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalProduct, setModalProduct] = useState<Product | null | undefined>(undefined);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [mode, setMode] = useState<"products" | "uncategorized">("products");
    const loadProducts = async (page = 1) => {
        try {
            const res = await getProducts(page);

            setProducts(res.data.data.data);

            setPaginationP({
                current_page: res.data.data.current_page,
                last_page: res.data.data.last_page,
                total: res.data.data.total,
            });

        } catch (err) {
            console.error(err);
        }
    };
    const loadUncategorized = async (page = 1) => {
        try {
            const res = await getUncategorizedProducts(page);

            setUncategorized(res.data.data.data);

            setPaginationC({
                current_page: res.data.data.current_page,
                last_page: res.data.data.last_page,
                total: res.data.data.total,
            });

        } catch (err) {
            console.error(err);
        }
    };
    const load = async () => {
        try {
            const [catRes, specRes] = await Promise.all([
                getCategories(), getSpecies(),
            ]);
            setCategories(catRes.data.data);
            setSpecies(specRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        loadProducts();
        loadUncategorized();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Supprimer ce produit ?")) return;
        setDeleting(id);
        try {
            const res=await deleteProduct(id);
            if(res.data.success){
                setProducts((prev) => prev.filter((p) => p.id !== id));
                alert(res.data.message)
            }
            
            
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(null);
        }
    };

    const handleUncategorizedResolved = (productId: number) => {
        setUncategorized((prev) => prev.filter((p) => p.id !== productId));
        load();
    };

    const filtered = products.filter(
        (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Produits</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{products.length} références</p>
                </div>
                <button
                    onClick={() => setModalProduct(null)}
                    className="flex items-center gap-2 px-4.5 py-3.5 bg-gradient-to-r from-orange-600 to-orange-400 hover:opacity-90 text-white text-sm font-medium rounded-full transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter produit
                </button>
            </div>
            <div className="flex  gap-4">
                <span
                    onClick={() => setMode('products')}
                    className={`px-4 py-2.5 bg-gray-200/50 rounded-full font-semibold hover:text-white
                ${mode === 'products' ? "bg-orange-600 text-white" : ""}
                hover:bg-orange-600 cursor-pointer`}>
                    Products
                </span>
                <span
                    onClick={() => setMode('uncategorized')}
                    className={`px-4 py-2.5 bg-gray-200/50 rounded-full font-semibold hover:text-white 
                ${mode === 'uncategorized' ? "bg-orange-600 text-white" : ""}
                hover:bg-orange-600 cursor-pointer`}>
                    Uncategories
                </span>

            </div>
            {mode == 'products' ? (

                <>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
                            placeholder="Rechercher un produit..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <ProductsTable products={filtered} loading={loading} onEdit={setModalProduct} onDelete={handleDelete} deletingId={deleting} />
                    <div className="flex items-center gap-2 mt-4">
                        {Array.from({ length: paginationP.last_page }, (_, i) => {
                            const page = i + 1;

                            return (
                                <button
                                    key={page}
                                    onClick={() => {loadProducts(page)}}
                                    className={`px-3 py-1.5 rounded-lg text-sm ${page === paginationP.current_page
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-orange-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>
                </>
            ) : (
                <>
                    <UncategorizedProductsPanel
                        products={uncategorized}
                        categories={categories}
                        species={species}
                        onUpdated={handleUncategorizedResolved}
                    />
                    <div className="flex items-center gap-2 mt-4">
                        {Array.from({ length: paginationC.last_page }, (_, i) => {
                            const page = i + 1;

                            return (
                                <button
                                    key={page}
                                    onClick={() => loadUncategorized(page)}
                                    className={`px-3 py-1.5 rounded-lg text-sm ${page === paginationC.current_page
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-orange-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>
                </>


            )}



            {modalProduct !== undefined && (
        <ProductModal product={modalProduct} categories={categories} onClose={() => setModalProduct(undefined)} onSaved={load} />
      )}
        </div>
    );
}