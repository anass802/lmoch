importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBkStDCQgDAPT8pr33DapHr6kBHmxffVBY",
    authDomain: "lmoch-2d4d5.firebaseapp.com",
    projectId: "lmoch-2d4d5",
    storageBucket: "lmoch-2d4d5.firebasestorage.app",
    messagingSenderId: "768026872855",
    appId: "1:768026872855:web:f6eed10b283ff08773a052",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/logo.png",
    });
});
