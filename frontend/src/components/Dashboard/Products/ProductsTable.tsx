import { Pencil, Trash2, Package } from "lucide-react";
import type { Product } from "../../../types/Clients";

const BASE_URL = import.meta.env.VITE_API_URL;

function getProductImageSrc(image: string | null, baseUrl: string) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${baseUrl}/storage/${image}`;
}

type Props = {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
};

export default function ProductsTable({ products, loading, onEdit, onDelete, deletingId }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-500/10 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide bg-gray-50">
                <th className="px-6 py-3 text-left font-medium">Produit</th>
                <th className="px-6 py-3 text-left font-medium">Catégorie</th>
                <th className="px-6 py-3 text-left font-medium">Prix de vente</th>
                
                <th className="px-6 py-3 text-left font-medium">Stock</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-orange-50/60 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex-shrink-0 overflow-hidden">
                          {product.image ? (
                            <img
                              src={getProductImageSrc(product.image, BASE_URL)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-orange-200" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      {product.category?.name ? (
                        <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full font-medium">
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-red-50 text-red-500 text-xs rounded-full font-medium">
                          Sans catégorie
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-gray-800">
                      {product.price.toLocaleString()} MAD
                    </td>
                    {/* <td className="px-6 py-3.5 font-semibold text-gray-800">
                      {product?.old_price.toLocaleString()} MAD
                    </td> */}
                    <td className="px-6 py-3.5">
                      <span className={`font-semibold ${product.stock <= 5 ? "text-red-500" : "text-gray-700"}`}>
                        {product.stock}
                      </span>
                      {product.stock <= 5 && <span className="ml-2 text-xs text-red-400">⚠ Faible</span>}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
      )}
    </div>
  );
}