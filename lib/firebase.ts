// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbN4ROdD_TAmmd4BmmzW6OLf8B3sv8S2M",
  authDomain: "aauuttooo-9c5e6.firebaseapp.com",
  projectId: "aauuttooo-9c5e6",
  storageBucket: "aauuttooo-9c5e6.firebasestorage.app",
  messagingSenderId: "212304817546",
  appId: "1:212304817546:web:7fecc147ca2cc43639ec73",
  measurementId: "G-99VPPV3CGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);