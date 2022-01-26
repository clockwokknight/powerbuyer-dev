// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyC-8KoYSEkjoa0LNG4S7tXRZ-AtFnR0f1E",
  authDomain: "vue-firebase-ad9a1.firebaseapp.com",
  projectId: "vue-firebase-ad9a1",
  storageBucket: "vue-firebase-ad9a1.appspot.com",
  messagingSenderId: "237351528174",
  appId: "1:237351528174:web:b3d91d1e46e6d767a8f5ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig) 
const auth = getAuth(app)

export{ auth }