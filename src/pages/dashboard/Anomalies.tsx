import { ShieldAlert, Download, Ban, FileSearch, ShieldCheck, ChevronRight } from 'lucide-react';
import Plot from 'react-plotly.js';

export default function Anomalies() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* Breadcrumb */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Investigation <ChevronRight className="w-3 h-3 mx-2" /> <span className="text-slate-800">ANOM-2024-0892</span>
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-full shadow-sm hover:bg-slate-50 transition-colors text-sm">
            <Download className="w-4 h-4 mr-2" /> Exporter
          </button>
          <button className="flex items-center px-5 py-2.5 bg-red-500 text-white font-bold rounded-full shadow-sm hover:bg-red-600 transition-colors text-sm">
            <Ban className="w-4 h-4 mr-2" /> Isoler le Segment
          </button>
        </div>
      </div>

      <div className="mb-10 flex items-center">
        <svg className="w-12 h-12 text-blue-600 mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
          Investigation<br/>Critique
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Incident Info */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full">Critique</span>
          </div>
          
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Type d'incident</div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight mb-8">
            Tentative<br/>d'Exfiltration (IA<br/>Detect)
          </h2>

          <div className="flex gap-8 mb-8 pb-8 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Horodatage</div>
              <div className="text-sm font-bold text-slate-800 text-nowrap">20 Oct 2024,<br/>14:23</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Durée</div>
              <div className="text-sm font-bold text-slate-800">14 min</div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">Signal IA</div>
            <p className="text-xs text-slate-500 italic leading-relaxed">
              "Volume sortant anormal vers IP (92.12.3.4) dépassant 400% de la moyenne historique du noeud."
            </p>
          </div>
        </div>

        {/* AI Risk Score */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-full text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Score de Risque IA</div>
          
          <div className="flex-1 w-full relative shrink-0 min-h-[250px]">
            <Plot
              data={[{
                type: "indicator",
                mode: "gauge+number",
                value: 94,
                number: { font: { size: 60, color: "#1e293b", family: "Inter, sans-serif", weight: 900 } },
                gauge: {
                  axis: { range: [null, 100], tickwidth: 0 },
                  bar: { color: "#ef4444", thickness: 0.15 },
                  bgcolor: "white",
                  borderwidth: 0,
                  steps: [
                    { range: [0, 50], color: "#f1f5f9" },
                    { range: [50, 80], color: "#e2e8f0" },
                    { range: [80, 100], color: "#fef2f2" },
                  ],
                }
              }]}
              layout={{
                margin: { t: 25, r: 25, l: 25, b: 25 },
                autosize: true
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              config={{ displayModeBar: false }}
            />
          </div>

          <div className="mt-2 text-center">
            <div className="text-2xl font-black text-red-500 mb-1 flex justify-center items-baseline gap-1">
              94<span className="text-sm text-slate-300">/100</span>
            </div>
            <div className="text-xs font-medium text-slate-400">Confiance modèle: 98.2%</div>
          </div>
        </div>

        {/* Priority Actions */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Actions Prioritaires</div>
          
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 hover:bg-blue-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mr-4">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 mb-1">Pare-feu dynamique</div>
                <div className="text-xs text-blue-600">Blocage port TCP:443 pour IP source.</div>
              </div>
            </div>

            <div className="flex items-start p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 hover:bg-orange-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mr-4">
                <FileSearch className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 mb-1">Deep Forensic Report</div>
                <div className="text-xs text-orange-600">Analyse détaillée des paquets bruts.</div>
              </div>
            </div>

            <div className="flex items-start p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mr-4">
                <ShieldAlert className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 mb-1">Revue des Accès</div>
                <div className="text-xs text-slate-500">Audit d'identité segment VPN-B.</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
