import { createContext, useContext, useState, type ReactNode } from "react";
import type { MoroccoCity } from "../data/moroccoCities";

interface CheckoutData {
    name: string;
    phone: string;
    city: MoroccoCity | "";
    address: string;
    shipping: number;
}

interface CheckoutContextType {
    data: CheckoutData;
    setData: (data: CheckoutData) => void;
    updateField: (field: keyof CheckoutData, value: any) => void;
    clearCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {

    const [data, setData] = useState<CheckoutData>({
        name: "",
        phone: "",
        city: "",
        address: "",
        shipping: 0,
    });

    const updateField = (field: keyof CheckoutData, value: any) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const clearCheckout = () => {
        setData({
            name: "",
            phone: "",
            city: "",
            address: "",
            shipping: 0,
        });
    };

    return (
        <CheckoutContext.Provider
            value={{
                data,
                setData,
                updateField,
                clearCheckout,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const ctx = useContext(CheckoutContext);
    if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
    return ctx;
}