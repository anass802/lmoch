import { CheckCircle2, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from '../../assets/images/logo/lmoch.png'
import jsPDF from "jspdf";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

type OrderItem = {
    id: number | string;
    name?: string;
    quantity: number;
    price: number;
    image?: string;
};

type OrderData = {
    items: OrderItem[];
    shipping: number;
    emballage: string;
    paid_by: string;
    points_used: number;
    name: string;
    phone: string;
    city: string;
    address: string;
    total: number;
};

type Props = {
    open: boolean;
    message: string;
    order: OrderData | null;
    onClose: () => void;
};

export default function SuccessModal({ open, message, order, onClose }: Props) {
    const BASE_URL = import.meta.env.VITE_API_URL
    const downloadReceipt = async () => {
        if (!order) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const navy = "#1E3A6E";
        const orange = "#F97316";
        const lightGray = "#F3F4F6";
        const textGray = "#374151";
        const fileName = `recu-commande-${Date.now()}.pdf`;

        // --- Header band ---
        doc.setFillColor(navy);
        doc.rect(0, 0, pageWidth, 32, "F");

        // Logo (top-left of header)
        try {
            const img = await loadImageAsBase64(logo);
            doc.addImage(img, "PNG", 14, 6, 20, 20);
        } catch {
            // logo failed to load, skip silently
        }

        doc.setTextColor("#FFFFFF");
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Reçu de commande", pageWidth - 14, 15, { align: "right" });
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(
            `#${Date.now().toString().slice(-8)}  •  ${new Date().toLocaleDateString("fr-FR")}`,
            pageWidth - 14,
            22,
            { align: "right" }
        );

        let y = 44;

        // --- Client info card ---
        doc.setDrawColor(230, 230, 230);
        doc.setFillColor(lightGray);
        doc.roundedRect(14, y, pageWidth - 28, 32, 3, 3, "F");

        doc.setTextColor(navy);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Client", 20, y + 8);

        doc.setTextColor(textGray);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`${order.name}`, 20, y + 15);
        doc.text(`${order.phone}`, 20, y + 21);
        doc.text(`${order.address}, ${order.city}`, 20, y + 27);

        doc.setTextColor(navy);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Paiement", pageWidth - 20, y + 8, { align: "right" });
        doc.setTextColor(textGray);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`${order.paid_by}`, pageWidth - 20, y + 15, { align: "right" });
        doc.text(`Emballage: ${order.emballage}`, pageWidth - 20, y + 21, { align: "right" });

        y += 42;

        // --- Items table header ---
        doc.setFillColor(navy);
        doc.rect(14, y, pageWidth - 28, 9, "F");
        doc.setTextColor("#FFFFFF");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Article", 20, y + 6);
        doc.text("Qté", pageWidth - 70, y + 6, { align: "center" });
        doc.text("Prix", pageWidth - 45, y + 6, { align: "center" });
        doc.text("Total", pageWidth - 20, y + 6, { align: "right" });

        y += 9;

        // --- Items rows ---
        doc.setFont("helvetica", "normal");
        for (const [idx, item] of order.items.entries()) {
            const rowHeight = 9;
            if (idx % 2 === 0) {
                doc.setFillColor(lightGray);
                doc.rect(14, y, pageWidth - 28, rowHeight, "F");
            }
            const lineTotal = (item.price * item.quantity).toFixed(2);
            doc.setTextColor(textGray);
            doc.setFontSize(9);

            let textX = 20;
            if (item.image) {
                try {
                    const imgData = await loadImageAsBase64(`${BASE_URL}/storage/${item.image}`);
                    doc.addImage(imgData, "PNG", 15, y + 0.5, 8, 8);
                    textX = 26; // shift text right to make room for the thumbnail
                } catch {
                    // image failed to load, skip silently
                }
            }

            doc.text(item.name ?? `Produit ${item.id}`, textX, y + 6, {
                maxWidth: pageWidth - 100 - (textX - 20),
            });
            doc.text(`${item.quantity}`, pageWidth - 70, y + 6, { align: "center" });
            doc.text(`${item.price.toFixed(2)}`, pageWidth - 45, y + 6, { align: "center" });
            doc.setFont("helvetica", "bold");
            doc.text(`${lineTotal} DH`, pageWidth - 20, y + 6, { align: "right" });
            doc.setFont("helvetica", "normal");
            y += rowHeight;
        }

        y += 6;

        // --- Totals box ---
        const boxWidth = 80;
        const boxX = pageWidth - 14 - boxWidth;
        doc.setDrawColor(230, 230, 230);
        doc.line(boxX, y, pageWidth - 14, y);
        y += 6;

        doc.setFontSize(9);
        doc.setTextColor(textGray);
        doc.text("Livraison", boxX, y);
        doc.text(`${order.shipping.toFixed(2)} DH`, pageWidth - 14, y, { align: "right" });
        y += 6;

        if (order.points_used > 0) {
            doc.text("Points utilisés", boxX, y);
            doc.text(`${order.points_used}`, pageWidth - 14, y, { align: "right" });
            y += 6;
        }

        y += 2;
        doc.setFillColor(orange);
        doc.roundedRect(boxX, y, boxWidth, 12, 2, 2, "F");
        doc.setTextColor("#FFFFFF");
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Total", boxX + 5, y + 8);
        doc.text(`${order.total.toFixed(2)} DH`, pageWidth - 19, y + 8, { align: "right" });

        // --- Footer ---
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setTextColor(180, 180, 180);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Merci pour votre commande !", pageWidth / 2, pageHeight - 10, { align: "center" });


        if (Capacitor.isNativePlatform()) {
            // Get PDF as base64 
            const pdfBase64 = doc.output("datauristring").split(",")[1];

            try {
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: pdfBase64,
                    directory: Directory.Cache, // Cache is writable + shareable without extra perms
                });

                await Share.share({
                    title: "Reçu de commande",
                    url: result.uri,
                    dialogTitle: "Partager ou enregistrer le reçu",
                });
            } catch (err) {
                console.error("Erreur lors de la génération du reçu :", err);
            }
        } else {
            // Web fallback 
            doc.save(fileName);
        }
    };

    // helper: load an imported image asset and convert to base64 for jsPDF
    const loadImageAsBase64 = (src: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (!ctx) return reject("no canvas ctx");
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            };
            img.onerror = reject;
            img.src = src;
        });
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl text-center max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>

                        <h3 className="text-lg font-bold text-[#1E3A6E] mb-1">
                            Commande confirmée !
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">{message}</p>

                        {order && (
                            <div className="text-left border rounded-xl p-4 mb-4 bg-gray-50">
                                <ul className="divide-y divide-gray-200 mb-3">
                                    {order.items.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex items-center justify-between py-2 text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                {item.image && (
                                                    <img
                                                        src={`${BASE_URL}/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="h-8 w-8 rounded object-cover"
                                                    />
                                                )}
                                                <span className="text-gray-700">
                                                    {item.name ?? `Produit ${item.id}`} x{item.quantity}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-800">
                                                {(item.price * item.quantity).toFixed(2)} DH
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex justify-between text-sm text-gray-600 pt-2 border-t">
                                    <span>Livraison</span>
                                    <span>{order.shipping.toFixed(2)} DH</span>
                                </div>
                                {order.points_used > 0 && (
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Points utilisés</span>
                                        <span>{order.points_used}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-bold text-[#1E3A6E] pt-2 border-t mt-2">
                                    <span>Total</span>
                                    <span>{order.total.toFixed(2)} DH</span>
                                </div>
                            </div>
                        )}

                        {order && (
                            <button
                                onClick={downloadReceipt}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1E3A6E] font-medium text-sm py-2.5 transition-colors mb-2"
                            >
                                <Download className="h-4 w-4" />
                                Télécharger le reçu
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm py-2.5 transition-colors"
                        >
                            Continuer
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}