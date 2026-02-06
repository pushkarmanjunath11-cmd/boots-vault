import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAfgkJX6cYsUC9yrAyQn9K8ER6KvIOmXoM",
    authDomain: "bootvault-2c294.firebaseapp.com",
    projectId: "bootvault-2c294",
    storageBucket: "bootvault-2c294.firebasestorage.app",
    messagingSenderId: "647469084219",
    appId: "1:647469084219:web:cbbd59b4e3c8429e72b61e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);