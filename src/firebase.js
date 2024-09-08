import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, doc, query, where } from 'firebase/firestore';

// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBJ12ni8p76nptWeos5kODO8LMqwyrS_Vs",
  authDomain: "oldao-d0123.firebaseapp.com",
  projectId: "oldao-d0123",
  storageBucket: "oldao-d0123.appspot.com",
  messagingSenderId: "314573279879",
  appId: "1:314573279879:web:bbbdd207f1e19802c31e22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, getDoc, setDoc, doc, query, where };
