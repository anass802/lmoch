import { Outlet } from "react-router-dom";
import HeaderClient from "../components/clients/Header";
import FooterClient from "../components/clients/FooterClient";
import { useState } from "react";
import CartShoping from "../components/clients/CartShoping";
import SearchBox from "../components/clients/Search";
import { useCart } from "../context/CartContext";
import SocialFloatingButton from "../components/clients/SocialFloatingButton";
import { Capacitor } from '@capacitor/core';


export default function ClientLayout() {
    const [modal, setModal] = useState<"search" | "user" | null>(null);
    const { isCartOpen, closeCart,openCart } = useCart();

    return (
        <div>

            <div
                className={`fixed inset-0 z-[999] flex justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeCart}
            >
                <div
                    className={`w-[420px] rounded-l-4xl h-full bg-white transform transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    onClick={(e) => e.stopPropagation()} // évite que le clic dans le panneau ne le referme
                >
                    <CartShoping onClose={closeCart} />
                </div>
            </div>
            {modal === "search" && (
                <SearchBox onClose={() => setModal(null)} />
            )}
            {modal === "search" && <SearchBox onClose={() => setModal(null)} />}
            <HeaderClient
                onOpenModal={(type) => {
                    if (type === "cart"){
                        // géré par useCart 
                        openCart()
                        return; 
                    
                    }
                        
                    setModal(type as "search" | "user");
                }} />
            <Outlet />
            <SocialFloatingButton />
            {!Capacitor.isNativePlatform() && <FooterClient />}
            
        </div>
    );
}