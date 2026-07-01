import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração oficial do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyADa-hOGVn76WPx0PMGzIYNO79Q_1qHEFA",
  authDomain: "cortestimey.firebaseapp.com",
  projectId: "cortestimey",
  storageBucket: "cortestimey.firebasestorage.app",
  messagingSenderId: "661972450235",
  appId: "1:661972450235:web:a0a21f3e89e70679a3e29e",
  measurementId: "G-J15M5HFBYQ"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore conectando à base de dados oficial do seu projeto (default)
export const db = getFirestore(app);

// Inicializa o Auth
export const auth = getAuth(app);

export { app };


