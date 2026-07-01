import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import TrialBlockedPage from './components/TrialBlockedPage';
import OnboardingWizard from './components/OnboardingWizard';
import MerchantDashboard from './components/MerchantDashboard';
import ClientBooking from './components/ClientBooking';
import { Service, Barber, Client, Appointment, OnboardingData, MerchantUser } from './types';
import { firebaseService } from './services/firebaseService';
import { notificationService } from './services/notificationService';

function isTrialActive(trialFimStr: string): boolean {
  // Format is DD/MM/YYYY
  const parts = trialFimStr.split('/');
  if (parts.length !== 3) return false;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  const expiryDate = new Date(year, month, day, 23, 59, 59, 999);
  const currentDate = new Date();
  
  return currentDate <= expiryDate;
}

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'auth' | 'onboarding' | 'dashboard' | 'clientBooking'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentMerchant, setCurrentMerchant] = useState<MerchantUser | null>(null);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial registered business info (Onboarding defaults)
  const defaultOnboarding: OnboardingData = {
    fullName: 'Cristoff Cauã',
    cellphone: '(82) 98724-3056',
    email: 'cristoff@gmail.com',
    businessName: 'Cortestime Barber Style',
    objectives: ['Organizar agenda', 'Implementar agendamento online'],
    cep: '57150-000',
    neighborhood: 'Antares',
    street: 'Avenida Menino Marcelo',
    number: '4200',
    complement: 'Salas 3 e 4'
  };

  // Default services list
  const defaultServices: Service[] = [
    { id: 'serv-1', name: 'Corte Social / Degradê', price: 45.00, durationMin: 30, commissionPercent: 50 },
    { id: 'serv-2', name: 'Barba Terapia com Toalha Quente', price: 35.00, durationMin: 30, commissionPercent: 50 },
    { id: 'serv-3', name: 'Cabelo & Barba Completo', price: 75.00, durationMin: 60, commissionPercent: 45 },
    { id: 'serv-4', name: 'Pezinho & Sobrancelha', price: 25.00, durationMin: 15, commissionPercent: 60 },
  ];

  // Default barbers (professionals)
  const defaultBarbers: Barber[] = [
    { id: 'barb-1', name: 'Henrique Souza', avatar: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=60', rating: 4.9, specialty: 'Cortes & Degradê' },
    { id: 'barb-2', name: 'Gustavo Alencar', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=60', rating: 4.8, specialty: 'Barba Terapia' },
    { id: 'barb-3', name: 'Carlos Penna', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60', rating: 5.0, specialty: 'Cortes Clássicos' },
  ];

  // Default Clients
  const defaultClients: Client[] = [
    { id: 'cli-1', name: 'Lucas de Souza', phone: '(82) 99872-4305', email: 'lucas@gmail.com' },
    { id: 'cli-2', name: 'Roberto Silva', phone: '(82) 99120-1049', email: 'roberto@yahoo.com' },
    { id: 'cli-3', name: 'André Albuquerque', phone: '(82) 98844-0392', email: 'andre.albu@gmail.com' },
  ];

  // Default appointments
  const defaultAppointments: Appointment[] = [
    { id: 'app-1', clientName: 'Roberto Silva', clientPhone: '(82) 99120-1049', serviceId: 'serv-1', barberId: 'barb-1', date: new Date().toISOString().split('T')[0], time: '09:00', status: 'pending' },
    { id: 'app-2', clientName: 'André Albuquerque', clientPhone: '(82) 98844-0392', serviceId: 'serv-2', barberId: 'barb-2', date: new Date().toISOString().split('T')[0], time: '10:00', status: 'pending' },
    { id: 'app-3', clientName: 'Carlos Penna', clientPhone: '(82) 98724-1111', serviceId: 'serv-3', barberId: 'barb-3', date: new Date().toISOString().split('T')[0], time: '11:00', status: 'pending' },
    { id: 'app-completed-1', clientName: 'Douglas Costa', clientPhone: '(82) 99341-2290', serviceId: 'serv-1', barberId: 'barb-1', date: new Date().toISOString().split('T')[0], time: '08:00', status: 'completed' },
    { id: 'app-completed-2', clientName: 'Renato Gaúcho', clientPhone: '(82) 99611-0012', serviceId: 'serv-2', barberId: 'barb-2', date: new Date().toISOString().split('T')[0], time: '08:30', status: 'completed' },
  ];

  const [services, setServices] = useState<Service[]>(defaultServices);
  const [barbers, setBarbers] = useState<Barber[]>(defaultBarbers);
  const [clients, setClients] = useState<Client[]>(defaultClients);
  const [appointments, setAppointments] = useState<Appointment[]>(defaultAppointments);

  // Compute OnboardingData dynamically based on current logged in Merchant
  const onboardingData: OnboardingData = currentMerchant ? {
    fullName: currentMerchant.nomeProprietario,
    cellphone: currentMerchant.whatsapp,
    email: currentMerchant.email,
    businessName: currentMerchant.nomeBarbearia,
    objectives: ['Organizar agenda'],
    cep: '57150-000',
    neighborhood: 'Centro',
    street: 'Rua Principal',
    number: '123',
    complement: ''
  } : defaultOnboarding;

  // Listen to Auth State Changes
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthChanged(async (fbUser) => {
      try {
        if (fbUser) {
          // Fetch authenticated merchant details
          const merchant = await firebaseService.getMerchant(fbUser.uid);
          if (merchant) {
            setCurrentMerchant(merchant);
            
            // Sync database connection
            const connected = await firebaseService.checkConnection();
            setFirebaseConnected(connected);

            if (connected) {
              // Seeds default lists if this merchant's collections are completely empty
              await firebaseService.seedInitialDataForMerchant(fbUser.uid, {
                services: defaultServices,
                barbers: defaultBarbers,
                clients: defaultClients,
                appointments: defaultAppointments
              });

              // Fetch isolated data
              const fbServices = await firebaseService.getServices(fbUser.uid);
              if (fbServices.length > 0) setServices(fbServices);

              const fbBarbers = await firebaseService.getBarbers(fbUser.uid);
              if (fbBarbers.length > 0) setBarbers(fbBarbers);

              const fbClients = await firebaseService.getClients(fbUser.uid);
              if (fbClients.length > 0) setClients(fbClients);

              const fbAppointments = await firebaseService.getAppointments(fbUser.uid);
              if (fbAppointments.length > 0) setAppointments(fbAppointments);
            }
            
            // If trial has expired, stay on landing (blocker will catch it)
            if (isTrialActive(merchant.trialFim)) {
              setViewMode('dashboard');
            } else {
              setViewMode('landing');
            }
          } else {
            setCurrentMerchant(null);
            setViewMode('landing');
          }
        } else {
          setCurrentMerchant(null);
          // Fallback to static defaults when logged out (so the client booking doesn't crash)
          setServices(defaultServices);
          setBarbers(defaultBarbers);
          setClients(defaultClients);
          setAppointments(defaultAppointments);
        }
      } catch (err) {
        console.error("Auth listener error:", err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [firebaseConnected]);

  // Automated background notifications scanning
  useEffect(() => {
    if (notificationService.isSupported() && notificationService.getPermissionStatus() === 'granted') {
      notificationService.registerServiceWorker();
    }

    // Run initially
    notificationService.scanAndNotify(appointments, services);

    // Run every 30 seconds
    const interval = setInterval(() => {
      notificationService.scanAndNotify(appointments, services);
    }, 30000);

    return () => clearInterval(interval);
  }, [appointments, services]);

  // Action methods to mutate state and push to Firestore
  const handleAddService = async (newService: Omit<Service, 'id'>) => {
    const id = `serv-${Date.now()}`;
    const item: Service = { id, ...newService };
    setServices(prev => [...prev, item]);
    if (firebaseConnected && currentMerchant) {
      await firebaseService.saveService(item, currentMerchant.uid);
    }
  };

  const handleAddBarber = async (newBarber: Omit<Barber, 'id' | 'rating'>) => {
    const id = `barb-${Date.now()}`;
    const item: Barber = { id, rating: 4.9, ...newBarber };
    setBarbers(prev => [...prev, item]);
    if (firebaseConnected && currentMerchant) {
      await firebaseService.saveBarber(item, currentMerchant.uid);
    }
  };

  const handleAddClient = async (newClient: Omit<Client, 'id'>) => {
    const id = `cli-${Date.now()}`;
    const item: Client = { id, ...newClient };
    setClients(prev => [...prev, item]);
    if (firebaseConnected && currentMerchant) {
      await firebaseService.saveClient(item, currentMerchant.uid);
    }
  };

  const handleAddAppointment = async (newApp: Omit<Appointment, 'id' | 'status'>) => {
    const id = `app-${Date.now()}`;
    const item: Appointment = { id, status: 'pending', ...newApp };
    setAppointments(prev => [item, ...prev]);
    if (firebaseConnected && currentMerchant) {
      await firebaseService.saveAppointment(item, currentMerchant.uid);
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status } : app
    ));
    if (firebaseConnected) {
      await firebaseService.updateAppointmentStatus(id, status);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await firebaseService.signOut();
    } catch (e) {
      console.error("Logout error:", e);
    }
    setCurrentMerchant(null);
    setViewMode('landing');
    setIsLoading(false);
  };

  const handleAuthSuccess = (merchant: MerchantUser) => {
    setCurrentMerchant(merchant);
    if (isTrialActive(merchant.trialFim)) {
      setViewMode('dashboard');
    } else {
      setViewMode('landing');
    }
  };

  const isExpired = currentMerchant ? !isTrialActive(currentMerchant.trialFim) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-blue/20 border-t-brand-blue animate-spin mb-4"></div>
        <p className="font-sans font-medium text-[#051b42]">Iniciando Cortestime...</p>
        <p className="font-mono text-xs text-gray-400 mt-2">Conectando ao Firebase Firestore...</p>
      </div>
    );
  }

  // Active Block for Trial Expiration
  if (currentMerchant && isExpired) {
    return <TrialBlockedPage merchant={currentMerchant} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen">
      {viewMode === 'landing' && (
        <LandingPage 
          onStartTrial={() => {
            setAuthMode('signup');
            setViewMode('auth');
          }}
          onLogin={() => {
            setAuthMode('login');
            setViewMode('auth');
          }}
          firebaseConnected={firebaseConnected}
        />
      )}

      {viewMode === 'auth' && (
        <AuthPage 
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setViewMode('landing')}
        />
      )}

      {viewMode === 'clientBooking' && (
        <ClientBooking 
          businessName={currentMerchant?.nomeBarbearia || onboardingData.businessName}
          services={services}
          barbers={barbers}
          onBookAppointment={handleAddAppointment}
          onClose={() => setViewMode(currentMerchant ? 'dashboard' : 'landing')}
        />
      )}

      {viewMode === 'dashboard' && (
        <MerchantDashboard 
          onboardingData={onboardingData}
          merchant={currentMerchant}
          services={services}
          barbers={barbers}
          clients={clients}
          appointments={appointments}
          onAddService={handleAddService}
          onAddBarber={handleAddBarber}
          onAddClient={handleAddClient}
          onAddAppointment={handleAddAppointment}
          onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          onLogout={handleLogout}
          firebaseConnected={firebaseConnected}
          onOpenClientBooking={() => setViewMode('clientBooking')}
        />
      )}
    </div>
  );
}

