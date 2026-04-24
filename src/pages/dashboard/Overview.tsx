import { Download, TrendingUp, ShieldCheck, Activity, Clock } from 'lucide-react';
import Plot from 'react-plotly.js';

// Dummy data for Scatter (K-Means)
const scatterData = Array.from({ length: 50 }, () => ({
  x: Math.random() * 10,
  y: Math.random() * 10,
  cluster: Math.floor(Math.random() * 3),
}));

// Heatmap Data (Isolation Forest Simulation)
const zData = Array(6).fill(0).map(() => Array(10).fill(0).map(() => Math.random()));

const COLORS = ['#f59e0b', '#1e3a8a', '#94a3b8']; // Orange, Blue, Gray

export default function Overview() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Intelligence Analytique</h1>
          <p className="text-slate-500 text-sm">Visualisation multidimensionnelle des flux et détection comportementale.</p>
        </div>
        <button className="flex items-center px-5 py-2.5 bg-orange-500 text-white font-bold rounded-full shadow-sm hover:bg-orange-600 transition-colors text-sm">
          <Download className="w-4 h-4 mr-2" /> Exporter PDF
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'ALERTES CRITIQUES', value: '12', sub: '+4 depuis 1h', subIcon: TrendingUp, color: 'red', icon: Activity },
          { label: 'CONFIANCE MODÈLE', value: '99.1%', sub: 'Stable', subIcon: ShieldCheck, color: 'green', icon: ShieldCheck },
          { label: 'NOEUDS ANALYSÉS', value: '14.2k', sub: 'Traitement temps réel', subIcon: null, color: 'blue', icon: Activity },
          { label: 'INVESTIGATION MOY.', value: '4.2s', sub: 'Optimisation IA', subIcon: null, color: 'orange', icon: Clock },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-colors">
            {/* Left color bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${kpi.color}-500`} />
            
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              {kpi.label}
            </div>
            <div className="text-4xl font-black text-slate-800 tracking-tighter mb-4">
              {kpi.value}
            </div>
            <div className={`flex items-center text-xs font-bold ${kpi.color === 'red' ? 'text-red-500' : kpi.color === 'green' ? 'text-green-500' : 'text-blue-500'} tracking-wide`}>
              {kpi.subIcon && <kpi.subIcon className="w-3 h-3 mr-1" />}
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Scatter Chart (K-Means) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-6 shrink-0">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Intelligence Cohorte (K-Means)</h3>
            <p className="text-xs text-slate-500 mt-1">Segmentation automatique des comportements réseau</p>
          </div>
          <div className="flex-1 w-full relative min-h-[250px]">
            <Plot
              data={[{
                x: scatterData.map(d => d.x),
                y: scatterData.map(d => d.y),
                mode: 'markers',
                type: 'scatter',
                marker: { 
                  color: scatterData.map(d => COLORS[d.cluster]), 
                  size: 10 
                }
              }]}
              layout={{
                margin: { t: 10, r: 10, b: 20, l: 30 },
                autosize: true,
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { gridcolor: '#f1f5f9', zeroline: false },
                yaxis: { gridcolor: '#f1f5f9', zeroline: false }
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              config={{ displayModeBar: false }}
            />
          </div>
        </div>

        {/* Heatmap (Isolation Forest) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-6 shrink-0">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Anomalies de Risque</h3>
            <p className="text-xs text-slate-500 mt-1">Détection des intrusions par Isolation Forest</p>
          </div>
          <div className="flex-1 w-full relative min-h-[250px] rounded-xl overflow-hidden">
            <Plot
              data={[{
                z: zData,
                type: 'heatmap',
                colorscale: [
                  [0, '#fff7ed'],   // orange-50
                  [0.3, '#ffedd5'], // orange-100
                  [0.5, '#fdba74'], // orange-300
                  [0.8, '#f97316'], // orange-500
                  [1, '#ef4444']    // red-500
                ],
                showscale: false
              }]}
              layout={{
                margin: { t: 0, r: 0, b: 0, l: 0 },
                autosize: true,
                xaxis: { visible: false },
                yaxis: { visible: false }
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              config={{ displayModeBar: false }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
