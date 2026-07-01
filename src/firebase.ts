import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração obtida do seu projeto Firebase provisionado
const firebaseConfig = {
  apiKey: "AIzaSyARuWfsZIwy75KaGmWw0_IiulZ_Lp-bgH8",
  authDomain: "cortestimey.firebaseapp.com",
  projectId: "cortestimey",
  storageBucket: "positive-decoder-ndzmz.firebasestorage.app",
  messagingSenderId: "576867565081",
  appId: "1:576867565081:web:e829e40f91fb500902f488"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore especificando a base de dados customizada criada no AI Studio
export const db = getFirestore(app, "ai-studio-barberflow-ad72a5af-c542-494c-b68b-a33897de01d2");

// Inicializa o Auth
export const auth = getAuth(app);

export { app };


