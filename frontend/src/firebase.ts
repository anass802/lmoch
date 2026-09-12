import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestFcmToken = async (): Promise<string | null> => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    try {
        return await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });
    } catch (err) {
        console.error("FCM token error", err);
        return null;
    }
};

export const listenForMessages = () => {
    onMessage(messaging, (payload) => {
        new Notification(payload.notification?.title ?? "Nouvelle commande", {
            body: payload.notification?.body,
            icon: "/logo.png",
        });
    });
};