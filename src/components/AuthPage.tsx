import React, { useState } from 'react';
import { motion } from 'motion/react';
import { firebaseService } from '../services/firebaseService';
import LogoIcon from './LogoIcon';
import { Mail, Lock, Building2, User, Phone, Eye, EyeOff, Sparkles, ArrowLeft, BadgeAlert } from 'lucide-react';
import { MerchantUser } from '../types';

interface AuthPageProps {
  onAuthSuccess: (merchant: MerchantUser) => void;
  onBackToLanding: () => void;
}

export default function AuthPage({ onAuthSuccess, onBackToLanding }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sign up fields
  const [nomeBarbearia, setNomeBarbearia] = useState('');
  const [nomeProprietario, setNomeProprietario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        if (!email || !senha) {
          throw new Error("Por favor, preencha todos os campos.");
        }
        const merchant = await firebaseService.signIn(email, senha);
        onAuthSuccess(merchant);
      } else {
        if (!email || !senha || !nomeBarbearia || !nomeProprietario || !whatsapp) {
          throw new Error("Por favor, preencha todos os campos.");
        }
        if (senha.length < 6) {
          throw new Error("A senha deve conter no mínimo 6 caracteres.");
        }
        const merchant = await firebaseService.signUp(email, senha, nomeBarbearia, nomeProprietario, whatsapp);
        onAuthSuccess(merchant);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let friendlyMessage = err.message || "Ocorreu um erro inesperado.";
      
      // Customize Firebase specific auth error messages
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        friendlyMessage = "E-mail ou senha incorretos. Verifique suas credenciais.";
      } else if (err.code === "auth/email-already-in-use") {
        friendlyMessage = "Este e-mail já está em uso por outra conta.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "Formato de e-mail inválido.";
      } else if (err.code === "auth/weak-password") {
        friendlyMessage = "A senha é muito fraca. Escolha uma senha mais forte.";
      }
      
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-brand-dark flex flex-col justify-between py-6 px-4 relative overflow-hidden">
      
      {/* Background soft elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-lime/10 rounded-full blur-3xl -z-10" />

      {/* HEADER WITH LOGO */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between pb-4 border-b border-gray-100">
        <button 
          onClick={onBackToLanding}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-1.5">
          <LogoIcon className="w-6 h-6" />
          <span className="font-sans font-extrabold text-lg text-[#051b42]">Cortestime</span>
        </div>

        <div className="w-9" /> {/* Spacer */}
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
          
          <div className="text-center mb-6">
            <h2 className="font-display font-bold text-2xl text-brand-dark">
              {isLogin ? 'Acesse sua barbearia' : 'Cadastre sua barbearia'}
            </h2>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1.5">
              {isLogin ? 'Pronto para começar?' : 'Teste grátis por 5 dias'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* SIGNUP SPECIFIC FIELDS */}
            {!isLogin && (
              <>
                {/* Nome da barbearia */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Nome da barbearia</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      required
                      value={nomeBarbearia}
                      onChange={e => setNomeBarbearia(e.target.value)}
                      placeholder="Ex: Barbearia do Bosque"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:outline-none transition-colors text-sm bg-gray-50"
                    />
                  </div>
                </div>

                {/* Nome do proprietário */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Nome do proprietário</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      required
                      value={nomeProprietario}
                      onChange={e => setNomeProprietario(e.target.value)}
                      placeholder="Ex: Carlos de Souza"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:outline-none transition-colors text-sm bg-gray-50"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">WhatsApp</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input 
                      type="tel" 
                      required
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="Ex: (82) 98724-3056"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:outline-none transition-colors text-sm bg-gray-50"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email (Common) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">E-mail</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Ex: proprietario@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:outline-none transition-colors text-sm bg-gray-50"
                />
              </div>
            </div>

            {/* Senha (Common) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">Senha</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="No mínimo 6 dígitos"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:outline-none transition-colors text-sm bg-gray-50 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
              <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold flex items-start gap-2 border border-red-100">
                <BadgeAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-blue hover:bg-brand-blue-light disabled:bg-gray-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-blue/10 transition-all uppercase text-xs tracking-wider mt-2 flex justify-center items-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  {!isLogin && <Sparkles className="w-4 h-4 text-brand-lime" />}
                  <span>{isLogin ? 'Entrar no Sistema' : 'Criar minha conta'}</span>
                </>
              )}
            </button>
          </form>

          {/* TOGGLE LINK */}
          <div className="text-center mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium">
              {isLogin ? 'Novo por aqui?' : 'Já possui uma conta?'}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-brand-blue hover:underline font-bold ml-1"
              >
                {isLogin ? 'Cadastre sua barbearia' : 'Fazer login'}
              </button>
            </p>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="max-w-md mx-auto w-full text-center text-[11px] text-gray-400">
        &copy; {new Date().getFullYear()} Cortestime S.A. Todos os direitos reservados.
      </footer>
    </div>
  );
}
