import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import LogoIcon from './LogoIcon';
import { ShieldAlert, Check, Landmark, Star, CreditCard, MessageCircle, LogOut } from 'lucide-react';
import { MerchantUser } from '../types';
import { notificationService } from '../services/notificationService';

interface TrialBlockedPageProps {
  merchant: MerchantUser;
  onLogout: () => void;
}

export default function TrialBlockedPage({ merchant, onLogout }: TrialBlockedPageProps) {
  useEffect(() => {
    if (!merchant.trialFim) return;
    const parts = merchant.trialFim.split('/');
    if (parts.length !== 3) return;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    const expiryDate = new Date(year, month, day, 23, 59, 59, 999);
    const now = new Date();
    
    // Clean hours
    const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const d2 = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate());
    
    const diffMs = d2.getTime() - d1.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // using Math.floor to represent exact days elapsed
    
    // "Após passar o tempo dos 5 dias 2 dias depois enviar uma notificação push uma vez por dia (não mais que isso)"
    // So if diffDays <= -2, we are 2 or more days past expiration
    if (diffDays <= -2) {
      const todayStr = now.toISOString().split('T')[0];
      const keySentToday = `sent-expired-daily-${todayStr}`;
      
      if (!localStorage.getItem(keySentToday)) {
        if (notificationService.isSupported() && notificationService.getPermissionStatus() === 'granted') {
          notificationService.triggerNotification(
            '💈 Cortestime Alerta',
            'Seus clientes continuam aguardando você. Reative sua assinatura quando desejar.',
            `expired-daily-${todayStr}`
          );
          localStorage.setItem(keySentToday, 'true');
        }
      }
    }
  }, [merchant]);

  const contactWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá! Gostaria de ativar a minha assinatura no Cortestime para a minha barbearia "${merchant.nomeBarbearia}". Meu e-mail é ${merchant.email}.`
    );
    window.open(`https://wa.me/${merchant.whatsapp.replace(/\D/g, '') || '5582987243056'}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#051b42] text-white flex flex-col justify-between py-8 px-4 relative overflow-hidden">
      
      {/* Background radial effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-lime/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl -z-10" />

      {/* HEADER */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <LogoIcon className="w-6 h-6" />
          <span className="font-sans font-extrabold text-lg text-white">Cortestime</span>
        </div>
        
        <button 
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </header>

      {/* MAIN BANNER */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-xl bg-[#09224f]/90 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative">
          
          {/* Locked Badge Icon */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#bffd32] text-[#051b42] p-5 rounded-full shadow-xl">
            <ShieldAlert className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="text-center mt-6 mb-8 space-y-4">
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-white">
              Seu período de teste terminou.
            </h2>
            <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              (Seus clientes, agendamentos e serviços continuam salvos com segurança).
            </p>
            <p className="text-sm font-semibold text-brand-lime">
              Ative um plano para continuar administrando sua barbearia.
            </p>
          </div>

          {/* Trial Details */}
          <div className="bg-[#051b42]/60 rounded-2xl p-4 border border-white/5 grid grid-cols-2 gap-4 text-center mb-8">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Início do Teste</p>
              <p className="text-sm font-mono font-bold text-gray-200 mt-0.5">{merchant.trialInicio}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Término do Teste</p>
              <p className="text-sm font-mono font-bold text-brand-lime mt-0.5">{merchant.trialFim}</p>
            </div>
          </div>

          {/* Premium Plan Features */}
          <div className="space-y-4 mb-8 text-left">
            <h3 className="text-xs font-bold text-brand-lime uppercase tracking-wider">
              O que você continuará aproveitando na versão Premium:
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Agendamento online 24h para clientes",
                "Agenda dinâmica dos profissionais",
                "Cálculo automático de comissão",
                "Histórico completo de faturamento",
                "Controle e cadastro de clientes",
                "WhatsApp integrado para notificações"
              ].map((feat, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs text-gray-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-3">
            <button 
              onClick={contactWhatsApp}
              className="w-full bg-brand-lime hover:bg-brand-lime-dark text-brand-dark font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-brand-lime/10 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Ativar meu acesso via WhatsApp</span>
            </button>
            <p className="text-[10px] text-center text-gray-400">
              Fale com nossa equipe comercial para ativar em segundos via PIX ou Cartão.
            </p>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="max-w-md mx-auto w-full text-center text-[11px] text-gray-500">
        &copy; {new Date().getFullYear()} Cortestime S.A. Simplificando a sua barbearia com inteligência.
      </footer>
    </div>
  );
}
