// Firebase Configuration with Safe Local Demo Fallback
// Set your .env credentials to connect live Firebase Auth, Firestore & Storage:
// VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'DEMO_API_KEY_SUSTHAYAN',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'susthayan-elderly-care.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'susthayan-elderly-care',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'susthayan-elderly-care.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1029384756',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1029384756:web:abcd1234efgh5678'
};

export const isLiveFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID
);

export const isGoogleMapsConfigured = Boolean(
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY
);
