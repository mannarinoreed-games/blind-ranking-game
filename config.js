// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNXF4Sa8jkXLhx9SKSQQwuhqVhgbsFWVw",
  authDomain: "blind-ranking-9cad1.firebaseapp.com",
  projectId: "blind-ranking-9cad1",
  storageBucket: "blind-ranking-9cad1.firebasestorage.app",
  messagingSenderId: "24888391855",
  appId: "1:24888391855:web:018488f0abd0221d86fc5a",
  measurementId: "G-NY8PTH9241"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
