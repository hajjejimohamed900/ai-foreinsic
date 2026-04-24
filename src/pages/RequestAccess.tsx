import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft, ChevronRight, Building, User, Shield, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

type Step = 1 | 2 | 3 | 4;

export default function RequestAccess() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    address: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    role: 'Analyste',
    agreed: false,
  });

  const updateForm = (key: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const steps = [
    { id: 1, label: 'ENTREPRISE', title: "Détails de l'Entreprise", sub: "Inscrivez les informations légales de votre organisation." },
    { id: 2, label: 'PERSONNEL', title: 'Informations du Personnel', sub: "Qui sera l'interréférent technique principal pour cette plateforme ?" },
    { id: 3, label: 'RÔLE', title: 'Rôle & Justification', sub: "Veuillez sélectionner votre niveau d'accès et justifier l'usage prévu." },
    { id: 4, label: 'FINALISATION', title: 'Récapitulatif & Finalisation', sub: "Veuillez valider vos informations avant de confirmer votre demande." },
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => (prev + 1) as Step);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-8">
        <div className="flex gap-2 items-center">
          <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <div className="text-xl font-bold text-slate-800 tracking-tight flex items-baseline">
            Sotetel
            <div className="flex gap-1 ml-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Connexion
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 sm:p-12 min-h-[600px] flex flex-col relative overflow-hidden">
        
        {/* Stepper */}
        <div className="relative mb-12">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
          <div className="relative z-10 flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors delay-100",
                    currentStep > step.id ? "bg-slate-800 text-white" : 
                    currentStep === step.id ? "bg-orange-500 text-white ring-4 ring-orange-50" : 
                    "bg-white text-slate-300 border-2 border-slate-100"
                  )}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={cn(
                  "mt-3 text-[10px] uppercase font-bold tracking-wider",
                  currentStep >= step.id ? "text-orange-500" : "text-slate-300"
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col relative w-full h-full">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{steps[currentStep-1].title}</h1>
            <p className="mt-2 text-sm text-slate-500">{steps[currentStep-1].sub}</p>
          </div>

          <div className="flex-1">
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nom de l'entreprise</label>
                    <input type="text" className="w-full border-slate-200 rounded-xl py-3 px-4 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" placeholder="Ex: Global Solutions" value={formData.companyName} onChange={e => updateForm('companyName', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Secteur</label>
                    <input type="text" className="w-full border-slate-200 rounded-xl py-3 px-4 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" placeholder="Télécommunications" value={formData.sector} onChange={e => updateForm('sector', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Siège social</label>
                    <input type="text" className="w-full border-slate-200 rounded-xl py-3 px-4 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" placeholder="Adresse complète, Ville, Pays" value={formData.address} onChange={e => updateForm('address', e.target.value)} />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nom Complet</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" className="w-full pl-10 border-slate-200 rounded-xl py-3 px-4 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" placeholder="Jean Dupont" value={formData.fullName} onChange={e => updateForm('fullName', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Professionnel</label>
                    <input type="email" className="w-full border-slate-200 rounded-xl py-3 px-4 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" placeholder="j.dupont@sotetel.tn" value={formData.email} onChange={e => updateForm('email', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Téléphone</label>
                    <input type="tel" className="w-full border-slate-200 rounded-xl py-3 px-4 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" placeholder="+216 -- --- ---" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Département</label>
                    <input type="text" className="w-full border-slate-200 rounded-xl py-3 px-4 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" placeholder="Ex: Cybersécurité / IT" value={formData.department} onChange={e => updateForm('department', e.target.value)} />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Profil d'Accès Privilégié</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'Analyste', icon: Building, desc: "Consultation des datasets et rapports IA sans droit de modification." },
                    { id: 'Enquêteur', icon: Shield, desc: "Outils forensic avancés, isolation d'anomalies et actions correctives." },
                    { id: 'Superviseur', icon: User, desc: "Gestion globale de la division, validation et audits de sécurité." }
                  ].map(role => (
                    <div 
                      key={role.id}
                      onClick={() => updateForm('role', role.id)}
                      className={cn(
                        "p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col",
                        formData.role === role.id 
                          ? "border-orange-500 bg-orange-50/50" 
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors",
                        formData.role === role.id ? "bg-orange-100 text-orange-500" : "bg-slate-50 text-slate-400"
                      )}>
                        <role.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2">{role.id}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{role.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Organisation</span>
                    <div className="flex items-center text-slate-800 font-medium">
                      <Building className="w-4 h-4 mr-2 text-slate-400" />
                      {formData.companyName || 'Non renseigné'}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Référent Technique</span>
                    <div className="flex items-center text-slate-800 font-medium">
                      <User className="w-4 h-4 mr-2 text-slate-400" />
                      {formData.fullName || 'Non renseigné'}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Direction / Service</span>
                    <div className="flex items-center text-slate-800 font-medium">
                      <div className="w-4 h-4 mr-2 text-slate-400" />
                      {formData.department || 'Non renseigné'}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Profil Demandé</span>
                    <div className="flex items-center font-bold text-orange-500 uppercase tracking-wide text-sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {formData.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-start bg-white border border-slate-100 p-4 rounded-xl">
                  <div className="flex items-center h-5">
                    <input 
                      id="agreed" 
                      type="checkbox" 
                      className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                      checked={formData.agreed}
                      onChange={e => updateForm('agreed', e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreed" className="font-medium text-slate-500 cursor-pointer">
                      En soumettant ce formulaire, je certifie l'exactitude des informations fournies et j'accepte sans réserve la <span className="font-bold text-slate-800 underline decoration-slate-300 underline-offset-2">politique de confidentialité</span> et les protocoles de sécurité des données de Sotetel AI Forensic.
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 mt-auto border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                onClick={handlePrev}
                className="flex items-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
              </button>
            ) : <div />}

            <button
              onClick={() => {
                if (currentStep === 4) {
                  navigate('/dashboard/investigation');
                } else {
                  handleNext();
                }
              }}
              className="flex items-center py-3 px-8 rounded-full shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all"
            >
              {currentStep === 4 ? 'Confirmer la Demande' : 'Suivant'} <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
