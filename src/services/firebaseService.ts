import { db, auth } from "../firebase";
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  updateDoc,
  query,
  where
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithRedirect // <-- Mudado aqui!
} from "firebase/auth";
import { Service, Barber, Client, Appointment, MerchantUser } from "../types";

// Collection Names
const COLL_SERVICES = "services";
const COLL_BARBERS = "barbers";
const COLL_CLIENTS = "clients";
const COLL_APPOINTMENTS = "appointments";

export const firebaseService = {
  // Test connection
  async checkConnection(): Promise<boolean> {
    try {
      const testDoc = doc(db, "connection_test", "status");
      await setDoc(testDoc, { connected: true, timestamp: Date.now() }, { merge: true });
      return true;
    } catch (e) {
      console.error("Firebase connection error:", e);
      return false;
    }
  },

  // Auth operations
  async signUp(email: string, password: string, nomeBarbearia: string, nomeProprietario: string, whatsapp: string): Promise<MerchantUser> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Calculate trial dates: today and 5 days later
    const today = new Date();
    const formatDate = (date: Date) => {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };
    
    const trialInicio = formatDate(today);
    
    const expiry = new Date();
    expiry.setDate(today.getDate() + 5);
    const trialFim = formatDate(expiry);
    
    const merchant: MerchantUser = {
      uid: user.uid,
      nomeBarbearia,
      nomeProprietario,
      email,
      whatsapp,
      plano: 'trial',
      trialInicio,
      trialFim,
      status: 'ativo',
      criadoEm: new Date().toISOString()
    };
    
    // Save to Firestore 'users' collection
    await setDoc(doc(db, "users", user.uid), merchant);
    return merchant;
  },

  async signIn(email: string, password: string): Promise<MerchantUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const docRef = doc(db, "users", user.uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      throw new Error("Cadastro da barbearia não encontrado no banco de dados.");
    }
    return snap.data() as MerchantUser;
  },

      async signInWithGoogle(): Promise<{ user: FirebaseUser; isNew: boolean; merchant?: MerchantUser } | null> {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
    return null;
  },

  async handleRedirectResult(): Promise<MerchantUser | null> {
    const { getRedirectResult } = await import("firebase/auth");
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as MerchantUser;
      }
    }
    return null;
  },

  async handleRedirectResult(): Promise<MerchantUser | null> {
    const { getRedirectResult } = await import("firebase/auth");
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as MerchantUser;
      }
    }
    return null;
  },

  async saveGoogleMerchantProfile(user: FirebaseUser, nomeBarbearia: string, nomeProprietario: string, whatsapp: string): Promise<MerchantUser> {
    const today = new Date();
    const formatDate = (date: Date) => {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };
    
    const trialInicio = formatDate(today);
    
    const expiry = new Date();
    expiry.setDate(today.getDate() + 5);
    const trialFim = formatDate(expiry);
    
    const merchant: MerchantUser = {
      uid: user.uid,
      nomeBarbearia,
      nomeProprietario,
      email: user.email || "",
      whatsapp,
      plano: 'trial',
      trialInicio,
      trialFim,
      status: 'ativo',
      criadoEm: new Date().toISOString()
    };
    
    await setDoc(doc(db, "users", user.uid), merchant);
    return merchant;
  },

  async signOut(): Promise<void> {
    await fbSignOut(auth);
  },

  async getMerchant(uid: string): Promise<MerchantUser | null> {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as MerchantUser;
    }
    return null;
  },

  onAuthChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Services (Isolated)
  async saveService(service: Service, ownerId: string): Promise<void> {
    const docRef = doc(db, COLL_SERVICES, service.id);
    await setDoc(docRef, { ...service, ownerId });
  },

  async getServices(ownerId: string): Promise<Service[]> {
    const q = query(collection(db, COLL_SERVICES), where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    const list: Service[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Service);
    });
    return list;
  },

  // Barbers (Isolated)
  async saveBarber(barber: Barber, ownerId: string): Promise<void> {
    const docRef = doc(db, COLL_BARBERS, barber.id);
    await setDoc(docRef, { ...barber, ownerId });
  },

  async getBarbers(ownerId: string): Promise<Barber[]> {
    const q = query(collection(db, COLL_BARBERS), where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    const list: Barber[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Barber);
    });
    return list;
  },

  // Clients (Isolated)
  async saveClient(client: Client, ownerId: string): Promise<void> {
    const docRef = doc(db, COLL_CLIENTS, client.id);
    await setDoc(docRef, { ...client, ownerId });
  },

  async getClients(ownerId: string): Promise<Client[]> {
    const q = query(collection(db, COLL_CLIENTS), where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    const list: Client[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Client);
    });
    return list;
  },

  // Appointments (Isolated)
  async saveAppointment(app: Appointment, ownerId: string): Promise<void> {
    const docRef = doc(db, COLL_APPOINTMENTS, app.id);
    await setDoc(docRef, { ...app, ownerId });
  },

  async getAppointments(ownerId: string): Promise<Appointment[]> {
    const q = query(collection(db, COLL_APPOINTMENTS), where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    const list: Appointment[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Appointment);
    });
    return list;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    const docRef = doc(db, COLL_APPOINTMENTS, id);
    await updateDoc(docRef, { status });
  },

  // Seeds initial defaults to Firestore if it's empty for this merchant
  async seedInitialDataForMerchant(ownerId: string, defaults: {
    services: Service[],
    barbers: Barber[],
    clients: Client[],
    appointments: Appointment[]
  }): Promise<void> {
    try {
      // Check and seed services
      const currentServices = await this.getServices(ownerId);
      if (currentServices.length === 0) {
        for (const s of defaults.services) {
          await this.saveService(s, ownerId);
        }
      }

      // Check and seed barbers
      const currentBarbers = await this.getBarbers(ownerId);
      if (currentBarbers.length === 0) {
        for (const b of defaults.barbers) {
          await this.saveBarber(b, ownerId);
        }
      }

      // Check and seed clients
      const currentClients = await this.getClients(ownerId);
      if (currentClients.length === 0) {
        for (const c of defaults.clients) {
          await this.saveClient(c, ownerId);
        }
      }

      // Check and seed appointments
      const currentApps = await this.getAppointments(ownerId);
      if (currentApps.length === 0) {
        for (const a of defaults.appointments) {
          await this.saveAppointment(a, ownerId);
        }
      }
    } catch (e) {
      console.error("Error seeding initial Firebase data for merchant:", e);
    }
  }
};
