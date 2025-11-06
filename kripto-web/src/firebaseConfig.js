// Import SDK Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Konfigurasi Firebase kamu (dari console)
const firebaseConfig = {
  apiKey: "AIzaSyCC03R1t3jRWCSAOjNYtx9w5HkECImTnXQ",
  authDomain: "keripto-98c3d.firebaseapp.com",
  projectId: "keripto-98c3d",
  storageBucket: "keripto-98c3d.firebasestorage.app",
  messagingSenderId: "1000153614696",
  appId: "1:1000153614696:web:09a957979d279e39462edd",
  measurementId: "G-ZB5FHJ6Q18"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore (Database)
const db = getFirestore(app);

// Inisialisasi Analytics (opsional)
const analytics = getAnalytics(app);

// Export agar bisa diakses dari file lain
export { db, analytics };
