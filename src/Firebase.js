// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoYVdF_MmkgJiEje2qol0OMVCy8QfloS0",
  authDomain: "fitness-website-thesis.firebaseapp.com",
  projectId: "fitness-website-thesis",
  storageBucket: "fitness-website-thesis.appspot.com",
  messagingSenderId: "937007230233",
  appId: "1:937007230233:web:0e1426e5181a993695e988"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const auth = getAuth(app);

export const database = getDatabase(app);

export { db };