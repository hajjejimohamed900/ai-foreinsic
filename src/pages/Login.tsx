import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-1/3 h-1/3 bg-orange-50 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white py-12 px-8 shadow-xl sm:rounded-3xl border border-slate-100">
          <div className="mb-10 text-center">
            {/* Logo placeholder */}
            <div className="flex justify-center items-center gap-2 mb-8">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <div className="text-2xl font-bold text-slate-800 tracking-tight flex items-baseline">
                Sotetel <span className="text-[10px] text-slate-400 ml-1 font-normal tracking-wide">smart enabler</span>
              </div>
              <div className="flex gap-1 ml-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              </div>
            </div>
            
            <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
              Portail Forensic
            </h2>
            <p className="mt-4 text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              Veuillez vous authentifier pour accéder à l'intelligence d'investigation.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Identifiant Professionnel
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-300" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  required
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-slate-200 rounded-xl py-3 px-4 bg-slate-50 outline-none transition-colors"
                  placeholder="nom@sotetel.tn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mot de Passe
                </label>
                <a href="#" className="text-xs font-bold text-orange-500 hover:text-orange-600 uppercase tracking-wider">
                  Oublié ?
                </a>
              </div>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-300" aria-hidden="true" />
                </div>
                <input
                  type="password"
                  required
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-slate-200 rounded-xl py-3 px-4 bg-slate-50 outline-none transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                Se souvenir de ce terminal
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Se Connecter <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-10 text-center text-sm text-slate-500">
            Besoin d'un accès ?{' '}
            <button
              onClick={() => navigate('/request-access')}
              className="font-bold text-slate-800 hover:text-orange-500 transition-colors"
            >
              Contacter l'administrateur
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
