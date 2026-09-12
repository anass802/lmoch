import Information from "../../components/clients/Checkout/Information";
import DeliveryOptions from "../../components/clients/Checkout/Deliveryoptions";
import OrderSummary from "../../components/clients/Checkout/Ordersummary";
import { MOROCCO_CITIES, type MoroccoCity } from "../../data/moroccoCities";
import { useState } from "react";
import { getUserName, getPhone,updatePointsBalance } from "../../api/auth/AuthService";
import type { InfoClientState } from "../../types/Clients";
import { checkout } from "../../api/ClientServices";
import { useCart } from "../../context/CartContext";
import SuccessModal from "../../components/Models/SuccessModal";
import { address } from "framer-motion/client";


const EMBALLAGE_PRICES: Record<string, number> = {
    gratuit: 0,
    standard: 5,
    premium: 10,
};
type EmballageType = ''|'gratuit' | 'standard' | 'premium';
export default function Checkout() {
    const name = getUserName() ?? "";
    const phone = getPhone() ?? "";
    const { items, clearCart } = useCart();
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [orderData,setOrderData]=useState<any>(null);
    const [shipping, setShipping] = useState(0);
    
    const [form, setForm] = useState<InfoClientState>({
        name,
        phone,
        city: "",
        address: "",
        points_used: 0,
        emballage:'',
        paid_by: "money",

    });
    const [errors, setErrors] = useState({
        name: "",
        phone: "",
        city: "",
        address: "",
        emballage: "",
        
    });
    const validate = () => {
        const newErrors = {
            name: form.name ? "" : "Nom est requis",
            phone: form.phone ? "" : "Téléphone est requis",
            city: form.city ? "" : "Ville est requise",
            address: form.address ? "" : "Adresse est requise",
            emballage: form.emballage ? "" : "Choisissez un emballage",
        };

        setErrors(newErrors);

        // check if any error exists
        return !Object.values(newErrors).some(e => e !== "");
    };
    const handlSubmit = async () => {
        if (!validate()) return;
        const payload = {
        
        name: form.name,
        phone: form.phone,
        city: form.city,
        address: form.address,
        emballage: form.emballage,
        paid_by: form.paid_by,
        points_used: form.points_used,
        items: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            image: item.image,
            value: item.value
        }))
    }
        try {
            const res = await checkout(payload)
            if (res.data.success) {
                clearCart();
                setSuccessMessage(res.data.message);
                const emballagePrice = EMBALLAGE_PRICES[form.emballage] || 0;
                const itemsTotal = items.reduce(
                    (sum, i) => sum + (Number(i.price) || 0) * i.quantity,
                    0
                );
                setOrderData({
                    items,
                    shipping,
                    emballage:form.emballage,
                    paid_by:form.paid_by,
                    points_used:form.points_used,
                    name:form.name,
                    phone:form.phone,
                    city:form.city,
                    address:form.address,
                    total: itemsTotal + shipping + emballagePrice,
                })
                setSuccessOpen(true);
                if (res.data.points_balance !== null && res.data.points_balance !== undefined) {
                    updatePointsBalance(res.data.points_balance);
                }
            }
        } catch (err: any) {
        console.error(err);
        const message =
            err.response?.data?.message ||
            (err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join("\n")
                : null) ||
            "Une erreur est survenue lors de la commande.";
        alert(message);
    }

    }

    const [selectedCity, setSelectedCity] = useState<MoroccoCity | "">("");
    
    return (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-4 py-4">
            <div className="flex flex-col gap-6">
                <Information cities={MOROCCO_CITIES} onCityChange={setSelectedCity} form={form} setForm={setForm} errors={errors} />
                <DeliveryOptions city={selectedCity} onShippingChange={setShipping} />
            </div>
            <OrderSummary shipping={shipping} form={form} setForm={setForm} onSubmit={handlSubmit} emballageError={errors.emballage} />
        </div>
        <SuccessModal
                order={orderData}
                open={successOpen}
                message={successMessage}
                onClose={() => setSuccessOpen(false)}
            />
        </>
        
    );
}