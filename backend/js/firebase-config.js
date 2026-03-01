/* ═══════════════════════════════════════════════════════════
   DIANOMY — Firebase Configuration
   Initializes Firebase Auth and Firestore.
   ═══════════════════════════════════════════════════════════ */

// These would normally be environment variables
const firebaseConfig = {
    projectId: "dianomy-delivery",
    appId: "1:492316319721:web:2e1b37b15451a55c99f578",
    storageBucket: "dianomy-delivery.firebasestorage.app",
    apiKey: "AIzaSyBSTHgEYP2KYYHGvbHlR1Ez5eK13n72-g8",
    authDomain: "dianomy-delivery.firebaseapp.com",
    messagingSenderId: "492316319721",
    measurementId: "G-ZGQFGK8861"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Auth Providers
const googleProvider = new firebase.auth.GoogleAuthProvider();

console.log('[DIANOMY] Firebase Initialized');
