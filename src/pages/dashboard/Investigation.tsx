import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Investigation() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // 🚨 THIS IS THE MAGIC FUNCTION THAT UNLOCKS THE HIDDEN PAGES 🚨
  const { setHasUploadedData } = useAppContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus('idle');

    const formData = new FormData();
    formData.append("logFile", file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        
        // 👉 THIS UNLOCKS THE SIDEBAR MENU INSTANTLY 👈
        setHasUploadedData(true);
        
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Upload failed", error);
      setStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 space-y-8 max-w-4xl mx-auto mt-10">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Investigation IA</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Uploadez vos fichiers de logs bruts (Syslog, NDJSON) pour déclencher l'analyse forensic automatisée de SOTETEL.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* File Input */}
          <div className="relative group">
            <input 
              type="file" 
              accept=".json,.ndjson,.csv,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isUploading}
            />
            <div className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
              file ? 'border-orange-500 bg-orange-50' : 'border-slate-300 bg-slate-50 group-hover:bg-slate-100 group-hover:border-slate-400'
            }`}>
              {file ? (
                <>
                  <FileText className="w-12 h-12 text-orange-500 mb-3" />
                  <p className="text-slate-900 font-bold text-center">{file.name}</p>
                  <p className="text-slate-500 text-sm mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-slate-400 mb-3" />
                  <p className="text-slate-700 font-semibold text-center mb-1">Cliquez ou glissez un fichier ici</p>
                  <p className="text-slate-500 text-sm text-center">Supporte .ndjson, .json, .csv</p>
                </>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
              !file 
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : isUploading 
                  ? 'bg-blue-600' 
                  : 'bg-orange-500 hover:bg-orange-600 hover:-translate-y-1 hover:shadow-orange-200/50'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyse Forensic en cours...
              </>
            ) : (
              <>
                Lancer l'Investigation IA
              </>
            )}
          </button>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <p className="text-sm font-medium">Analyse terminée ! Les pages du tableau de bord ont été déverrouillées.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="text-sm font-medium">Erreur lors de l'analyse. Vérifiez que le script Python fonctionne correctement sur le serveur.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}