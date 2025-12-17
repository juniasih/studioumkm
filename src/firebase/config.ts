// Fallback values are for when the app is not running in a browser environment (e.g. server-side rendering)
// and the .env.local file is not available.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB2KQSmzSvtaxSx7lLcpWtkb0K3h0J_-Oo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-1373278059-c3ddd.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-1373278059-c3ddd",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-1373278059-c3ddd.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "532301190326",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:532301190326:web:c7968d344bfdffe962c217",
  measurementId: ""
};
