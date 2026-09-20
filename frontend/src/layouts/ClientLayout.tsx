import { Outlet } from "react-router-dom";
import HeaderClient from "../components/clients/Header";
import FooterClient from "../components/clients/FooterClient";
import { useState, useEffect } from "react";
import CartShoping from "../components/clients/CartShoping";
import SearchBox from "../components/clients/Search";
import { useCart } from "../context/CartContext";
import SocialFloatingButton from "../components/clients/SocialFloatingButton";
import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { Capacitor } from '@capacitor/core';
import { requestFcmToken, listenForMessages } from "../firebase";
import api from "../api/api";

export default function ClientLayout() {
    const [modal, setModal] = useState<"search" | "user" | null>(null);
    const { isCartOpen, closeCart, openCart } = useCart();
    async function setupPushNotifications() {
  if (!Capacitor.isNativePlatform()) return;

  const perm = await FirebaseMessaging.requestPermissions();
  if (perm.receive !== "granted") return;

  try {
    const { token } = await FirebaseMessaging.getToken();
    console.log("FCM token:", token);
    const res = await api.post("/save-fcm-token", {
      token,
      platform: Capacitor.getPlatform(),
    });
    console.log("save-fcm-token:", res.status, res.data);
  } catch (e) {
    console.error("getToken/save failed", e);
  }

  await FirebaseMessaging.removeAllListeners();
  await FirebaseMessaging.addListener("tokenReceived", ({ token }) => {
    api.post("/save-fcm-token", { token, platform: Capacitor.getPlatform() }).catch(console.error);
  });
  await FirebaseMessaging.addListener("notificationReceived", (e) =>
    console.log("Push (foreground):", JSON.stringify(e.notification))
  );
  await FirebaseMessaging.addListener("notificationActionPerformed", (e) =>
    console.log("Push tapped:", JSON.stringify(e.notification))
  );
}
    useEffect(() => {
        (async () => {
            if (Capacitor.isNativePlatform()) {
                await setupPushNotifications();
            } else {
                const token = await requestFcmToken();
                console.log("🔥 FCM TOKEN:", token);
                if (token) {
                    const res = await api.post(`/save-fcm-token`, { token });
                    console.log("✅ saved:", res.data);
                }
                listenForMessages();
            }
        })();
    }, []);

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

            {modal === "search" && <SearchBox onClose={() => setModal(null)} />}
            <HeaderClient
                onOpenModal={(type) => {
                    if (type === "cart") {
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