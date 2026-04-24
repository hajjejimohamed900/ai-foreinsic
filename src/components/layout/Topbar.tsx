export default function Topbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 flex-shrink-0 z-10">
      
      {/* Left section: App Title / Badge */}
      <div className="flex items-center">
        <h1 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-3">
          AI FORENSIC CO-PILOT
          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] tracking-widest font-bold">ALPHA V2.4</span>
        </h1>
      </div>

      {/* Right section: Status & User */}
      <div className="flex items-center space-x-6">
        
        {/* Server Status */}
        <div className="flex items-center px-4 py-1.5 bg-green-50 rounded-full border border-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-xs font-bold text-green-700">Serveur Actif</span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center cursor-pointer group">
          <div className="text-right mr-3">
            <div className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">Admi. Sotetel</div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Système Manager</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            AS
          </div>
        </div>
      </div>
      
    </header>
  );
}
