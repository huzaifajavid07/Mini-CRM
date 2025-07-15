// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANF-QdV5dwskgPO874-eCXyC3x29pX944",
  authDomain: "minicrm-4c9c0.firebaseapp.com",
  projectId: "minicrm-4c9c0",
  storageBucket: "minicrm-4c9c0.appspot.com",  // ✅ fixed
  messagingSenderId: "476280334094",
  appId: "1:476280334094:web:62647431fc7c9526b0995f",
  measurementId: "G-GGXC9PGDM3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Optional: only enable analytics if supported
let analytics;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, analytics, auth };
