// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDbX-iHGM3DC1yZTagwiyTuzI5d3hs6Vo",
  authDomain: "catalog-91a0c.firebaseapp.com",
  projectId: "catalog-91a0c",
  storageBucket: "catalog-91a0c.firebasestorage.app",
  messagingSenderId: "680438200697",
  appId: "1:680438200697:web:3ead3957922985475997a8",
  measurementId: "G-9C7834LB6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestoreのデータベースを使えるように準備して、他のファイルで使えるようにエクスポートする
export const db = getFirestore(app);