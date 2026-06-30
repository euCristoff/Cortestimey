import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  User, 
  Scissors, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Smartphone, 
  Mail, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Service, Barber, Appointment } from '../types';

interface ClientBookingProps {
  businessName: string;
  services: Service[];
  barbers: Barber[];
  onBookAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  onClose: () => void;
}

export default function ClientBooking({ 
  businessName, 
  services, 
  barbers, 
  onBookAppointment, 
  onClose 
}: ClientBookingProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  
  // Date selection
  const today = new Date();
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  };
  const weekDates = getDates();
  const [selectedDate, setSelectedDate] = useState<Date>(weekDates[0]);

  // Hours slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];
  const [selectedTime, setSelectedTime] = useState<string>('09:00');

  // Client info
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleSelectBarber = (barber: Barber) => {
    setSelectedBarber(barber);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedBarber) {
      alert('Por favor, selecione um serviço e um profissional.');
      return;
    }
    if (!clientName || !clientPhone) {
      alert('Por favor, preencha seu nome e celular.');
      return;
    }

    // Format Date to YYYY-MM-DD
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    onBookAppointment({
      clientName,
      clientPhone,
      serviceId: selectedService.id,
      barberId: selectedBarber.id,
      date: dateStr,
      time: selectedTime,
    });

    setBookingConfirmed(true);
  };

  const formatDayOfWeek = (d: Date) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    if (d.getDate() === today.getDate()) return 'Hoje';
    return days[d.getDay()];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4 flex justify-between items-center shadow-sm">
        <button 
          onClick={bookingConfirmed ? onClose : () => {
            if (step > 1) setStep(prev => (prev - 1) as any);
            else onClose();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-dark"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
        <div>
          <h2 className="text-sm font-extrabold text-brand-dark uppercase tracking-wide">
            {businessName || 'Barbearia Premium'}
          </h2>
          <p className="text-[10px] text-gray-400 text-center">Agendamento Online de Clientes</p>
        </div>
        <div className="w-12"></div> {/* Spacer for symmetry */}
      </header>

      {/* CONTENT BODY */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
          {bookingConfirmed ? (
            <motion.div 
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6"
            >
              <div className="w-16 h-16 bg-brand-lime/20 text-brand-lime-dark rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-bold text-2xl text-brand-dark">Agendamento Confirmado!</h3>
                <p className="text-xs text-gray-500">
                  Seu horário foi reservado com sucesso no sistema da barbearia.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl text-left text-xs space-y-2 border border-gray-100">
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400">Serviço</span>
                  <span className="font-bold text-brand-dark">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400">Profissional</span>
                  <span className="font-bold text-brand-dark">{selectedBarber?.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400">Data</span>
                  <span className="font-bold text-brand-dark">
                    {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400">Horário</span>
                  <span className="font-bold text-brand-dark">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Preço</span>
                  <span className="font-bold text-brand-blue">R$ {selectedService?.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-brand-blue/5 text-brand-blue rounded-xl text-[11px] font-semibold flex items-center gap-2 justify-center">
                <Sparkles className="w-4 h-4" />
                <span>Enviamos um link de confirmação para seu WhatsApp!</span>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-3 px-4 rounded-xl shadow-md"
              >
                Voltar ao Início
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              
              {/* STEP PROGRESS INDICATOR */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 pb-2">
                <span className={step >= 1 ? 'font-bold text-brand-blue' : ''}>1. Serviço</span>
                <ChevronRight className="w-3 h-3" />
                <span className={step >= 2 ? 'font-bold text-brand-blue' : ''}>2. Profissional & Horário</span>
                <ChevronRight className="w-3 h-3" />
                <span className={step >= 3 ? 'font-bold text-brand-blue' : ''}>3. Seus Dados</span>
              </div>

              {/* STEP 1: SERVICE SELECT */}
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 text-left"
                >
                  <h3 className="font-display font-bold text-lg text-brand-dark">Selecione o Serviço</h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {services.map((service) => (
                      <div 
                        key={service.id}
                        onClick={() => handleSelectService(service)}
                        className="bg-white hover:border-brand-blue border border-gray-200 rounded-2xl p-4 flex justify-between items-center cursor-pointer transition-all hover:shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-xl">
                            <Scissors className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm sm:text-base text-brand-dark">{service.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{service.durationMin} min</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-sm sm:text-base text-brand-blue">R$ {service.price.toFixed(2)}</p>
                          <span className="text-[10px] text-gray-400 font-semibold block mt-1">Reservar &gt;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PROFESSIONAL AND TIME */}
              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 text-left"
                >
                  <h3 className="font-display font-bold text-lg text-brand-dark">Escolha o Profissional</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {barbers.map((barber) => (
                      <div 
                        key={barber.id}
                        onClick={() => handleSelectBarber(barber)}
                        className={`rounded-2xl p-3 border-2 text-center cursor-pointer transition-all ${
                          selectedBarber?.id === barber.id 
                            ? 'border-brand-blue bg-[#f0f7ff]' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={barber.avatar} 
                          alt={barber.name} 
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-white shadow-sm"
                        />
                        <p className="font-bold text-xs text-brand-dark mt-2 truncate">{barber.name}</p>
                        <p className="text-[9px] text-gray-400">{barber.specialty}</p>
                        <p className="text-[10px] text-yellow-500 font-bold mt-0.5">★ {barber.rating}</p>
                      </div>
                    ))}
                  </div>

                  {selectedBarber && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-2"
                    >
                      <h3 className="font-display font-bold text-lg text-brand-dark">Selecione o Dia</h3>
                      
                      {/* Dates horizontal scroll */}
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {weekDates.map((date, idx) => {
                          const isSelected = selectedDate.getDate() === date.getDate();
                          return (
                            <button 
                              key={idx}
                              type="button"
                              onClick={() => setSelectedDate(date)}
                              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border shrink-0 w-14 transition-all ${
                                isSelected 
                                  ? 'bg-brand-blue text-white border-brand-blue shadow-md shadow-brand-blue/15' 
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className="text-[10px] font-bold uppercase">{formatDayOfWeek(date)}</span>
                              <span className="text-sm font-extrabold mt-0.5">{date.getDate()}</span>
                            </button>
                          );
                        })}
                      </div>

                      <h3 className="font-display font-bold text-lg text-brand-dark">Horários Disponíveis</h3>
                      
                      {/* Grid of slots */}
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time, idx) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button 
                              key={idx}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                                isSelected 
                                  ? 'bg-brand-dark text-white border-brand-dark' 
                                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                               {time}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-4">
                        <button 
                          onClick={() => setStep(3)}
                          className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-3 rounded-xl shadow-lg transition-colors"
                        >
                          Confirmar Data & Horário
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: CLIENT DETAILS */}
              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 text-left"
                >
                  <h3 className="font-display font-bold text-lg text-brand-dark">Seus Dados de Contato</h3>
                  
                  <div className="bg-brand-blue/5 p-4 rounded-2xl border border-brand-blue/10 mb-4 text-xs space-y-1.5 text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-semibold">Serviço:</span>
                      <span className="font-bold text-brand-dark">{selectedService?.name} (R$ {selectedService?.price.toFixed(2)})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Profissional:</span>
                      <span className="font-bold text-brand-dark">{selectedBarber?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Data e Hora:</span>
                      <span className="font-bold text-brand-dark">
                        {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} às {selectedTime}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>Seu Nome Completo</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        placeholder="Ex: Roberto Silva"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:outline-none transition-colors text-sm bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                        <span>Seu WhatsApp (Celular)</span>
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={clientPhone}
                        onChange={e => setClientPhone(e.target.value)}
                        placeholder="Ex: (82) 99999-9999"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:outline-none transition-colors text-sm bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>Seu E-mail (Opcional)</span>
                      </label>
                      <input 
                        type="email" 
                        value={clientEmail}
                        onChange={e => setClientEmail(e.target.value)}
                        placeholder="Ex: roberto@gmail.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:outline-none transition-colors text-sm bg-white"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-3.5 rounded-xl shadow-lg transition-colors uppercase text-xs tracking-wider"
                      >
                        Finalizar Agendamento
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
