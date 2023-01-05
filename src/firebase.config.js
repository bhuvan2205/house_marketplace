// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCPnkCtH9LZa6UnQiGkdpChDRsuRZzX8uo",
    authDomain: "house-marketplace-68aa0.firebaseapp.com",
    projectId: "house-marketplace-68aa0",
    storageBucket: "house-marketplace-68aa0.appspot.com",
    messagingSenderId: "714432861822",
    appId: "1:714432861822:web:6abe92ee7faca1d2ccaa2f"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
