import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração obtida do seu projeto Firebase provisionado
const firebaseConfig = {
  apiKey: "AIzaSyADa-hOGVn76WPx0PMGzIYNO79Q_1qHEFA",
  authDomain: "cortestimey.firebaseapp.com",
  projectId: "cortestimey",
  storageBucket: "cortestimey.firebasestorage.app",
  messagingSenderId: "661972450235",
  appId: "1:661972450235:web:a0a21f3e89e70679a3e29e"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore especificando a base de dados customizada criada no AI Studio
export const db = getFirestore(app, "ai-studio-barberflow-ad72a5af-c542-494c-b68b-a33897de01d2");

// Inicializa o Auth
export const auth = getAuth(app);

export { app };


