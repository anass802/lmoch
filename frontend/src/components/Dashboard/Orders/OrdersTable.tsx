import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Phone, Package, Gift, Truck } from "lucide-react";
import type { OrderDetail, OrderStatus } from "../../../types/admin";
import OrderStatusBadge from "./OrderStatusBadge";
import ImageLightbox from "./ImageLightbox";
import truncateWords from "../../../utils/truncateWords";

const BASE_URL = import.meta.env.VITE_API_URL;

function getProductImageSrc(image?: string | null) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${BASE_URL}/storage/${image}`;
}

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-700", "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700", "bg-fuchsia-100 text-fuchsia-700",
];
function getInitials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : (parts[0]?.slice(0, 2).toUpperCase() ?? "?");
}
function avatarColor(name?: string) {
  return name ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] : AVATAR_COLORS[0];
}
function isRecent(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() <= 48 * 60 * 60 * 1000;
}

type Props = {
  orders: OrderDetail[];
  loading: boolean;
  onStatusChanged: (orderId: number, status: OrderStatus) => void;
};

export default function OrdersTable({ orders, loading, onStatusChanged }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide bg-gray-50">
              <th className="px-6 py-3 text-left font-medium">ID</th>
              <th className="px-6 py-3 text-left font-medium">Client</th>
              <th className="px-6 py-3 text-left font-medium">Ville</th>
              <th className="px-6 py-3 text-left font-medium">Panier</th>
              <th className="px-6 py-3 text-left font-medium">Livraison</th>
              <th className="px-6 py-3 text-left font-medium">Total</th>
              <th className="px-6 py-3 text-left font-medium">Statut</th>
              <th className="px-6 py-3 text-right font-medium">Date</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 ? (
              <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-400">Aucune commande trouvée</td></tr>
            ) : (
              orders.map((order) => (
                <>
                  <tr key={order.id} className="hover:bg-orange-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs text-gray-400">
                      #{order.id}
                      {isRecent(order.created_at) && (
                        <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-orange-500" title="Moins de 48h" />
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(order.user?.name)}`}>
                          {getInitials(order.user?.name)}
                        </div>
                        <span className="font-medium text-gray-800">{order.user?.name ?? "Invité"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{order.city}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full font-medium">
                        {order.items.length} article(s)
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{Number(order.shipping).toLocaleString()} MAD</td>
                    <td className="px-6 py-3.5 font-semibold text-gray-800">{Number(order.total_price).toLocaleString()} MAD</td>
                    <td className="px-6 py-3.5">
                      <OrderStatusBadge orderId={order.id} status={order.status} onChanged={(s) => onStatusChanged(order.id, s)} />
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-400 text-right">
                      {new Date(order.created_at).toLocaleString("fr-MA", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                        className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        {expanded === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                  {expanded === order.id && (
                    <tr className="bg-orange-50/30">
                      <td colSpan={9} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1.5 text-gray-600">
                            <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-orange-500" /> {order.phone}</p>
                            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-orange-500" /> {order.address}, {order.city}</p>
                            {order.embalage && (
                              <p className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-orange-500" /> Emballage : {order.embalage}</p>
                            )}
                            {!!order.points_used && (
                              <p className="flex items-center gap-1.5"><Gift className="w-3.5 h-3.5 text-orange-500" /> {order.points_used} points utilisés</p>
                            )}
                            <p className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-orange-500" /> Livraison : {Number(order.shipping).toLocaleString()} MAD</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Articles</p>
                            <div className="space-y-2">
                              {order.items.map((item) => {
                                const imgSrc = getProductImageSrc(item.image);
                                return (
                                  <div key={item.id} className="flex items-center justify-between text-gray-600">
                                    <div className="flex items-center gap-2.5">
                                      {imgSrc ? (
                                        <img
                                          src={imgSrc}
                                          alt={item.product?.name ?? ""}
                                          onClick={() =>
                                            setLightbox({ src: imgSrc, alt: item.product?.name ?? "" })
                                          }
                                          className="w-8 h-8 rounded-lg object-cover border border-orange-100 cursor-zoom-in hover:scale-105 transition-transform"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                          <Package className="w-3.5 h-3.5 text-orange-200" />
                                        </div>
                                      )}
                                      <div className="flex flex-col truncate">
                                        <span>{truncateWords(item.product?.name)?? `Produit #${item.product_id}`} × {item.quantity}</span>
                                      <span>{item.value ? `(${item.value})` : null}</span>
                                      </div>
                                      
                                    </div>
                                    <span className="font-medium text-gray-800">{Number(item.total).toLocaleString()} MAD</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      )}

      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}