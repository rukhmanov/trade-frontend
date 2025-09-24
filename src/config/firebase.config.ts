// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuCt3L62O9pvNsyGdkbn9lPHEnszvMb9A",
  authDomain: "parsifal-3478e.firebaseapp.com",
  projectId: "parsifal-3478e",
  storageBucket: "parsifal-3478e.firebasestorage.app",
  messagingSenderId: "402456930037",
  appId: "1:402456930037:web:e15968953a88041d0307bc",
  measurementId: "G-ZZCF0DRJXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
