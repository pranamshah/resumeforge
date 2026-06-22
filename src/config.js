// Fill in your values after Firebase setup — see docs/FIREBASE_SETUP.md
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyANlKsnE7JPy-TBC67_kYdOSaFM-7TH6sg",
  authDomain: "resumeforge-27733.firebaseapp.com",
  projectId: "resumeforge-27733",
  storageBucket: "resumeforge-27733.firebasestorage.app",
  messagingSenderId: "406485059840",
  appId: "1:406485059840:web:7647738b62aef8907e8be5",
};

// Your Gmail — this account gets admin dashboard access
export const ADMIN_EMAIL = "shahpranam31@gmail.com";

// Reads from Vercel environment variable VITE_GROQ_KEY
export const DEFAULT_GROQ_KEY = import.meta.env.VITE_GROQ_KEY || "";
