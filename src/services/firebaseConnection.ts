import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3MUNmezZ2cch0LXOLqZbvh7TYDo3clUA",
  authDomain: "tarefasplus-6412d.firebaseapp.com",
  projectId: "tarefasplus-6412d",
  storageBucket: "tarefasplus-6412d.firebasestorage.app",
  messagingSenderId: "784284690221",
  appId: "1:784284690221:web:9b9ff4349886f29a2555a4"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore()

export {db}