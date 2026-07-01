import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração obtida do seu projeto Firebase provisionado
const firebaseConfig = {
  apiKey: "AIzaSyARuWfsZIwy75KaGmWw0_IiulZ_Lp-bgH8",
  authDomain: "cortestimey.firebaseapp.com",
  projectId: "cortestimey",
  storageBucket: "cortestimey.firebasestorage.app",
  messagingSenderId: "661972450235",
  appId: "1:661972450235:web:a0a21f3e89e70679a3e29e"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore especificando a base de dados customizada criada no AI Studio
export const db = getFirestore(app);

// Inicializa o Auth
export const auth = getAuth(app);

export { app };


