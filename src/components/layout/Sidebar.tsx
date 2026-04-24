import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Network, AlertTriangle, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../context/AppContext';

export default function Sidebar() {
  const { hasUploadedData } = useAppContext();

  const allNavItems = [
    { name: 'Tableau de Bord', path: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'Investigation IA', path: '/dashboard/investigation', icon: Search },
    { name: "Détection d'Anomalies", path: '/dashboard/anomalies', icon: AlertTriangle },
    { name: 'Rapports', path: '/dashboard/reports', icon: FileText },
  ];

  // Only show "Investigation IA" initially. Show all after user uploads a file.
  const navItems = hasUploadedData 
    ? allNavItems 
    : allNavItems.filter(item => item.name === 'Investigation IA');

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-full flex-shrink-0 z-20">
      {/* Brand */}
      <div className="h-20 flex items-center px-8 shrink-0">
        <div className="flex justify-center items-center gap-2">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <div className="text-xl font-bold text-slate-800 tracking-tight flex items-baseline">
            Sotetel <span className="text-[8px] text-slate-400 ml-1 font-normal tracking-wide">smart enabler</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center px-4 py-3 text-sm font-medium transition-all rounded-r-full relative group",
              isActive 
                ? "text-slate-900 bg-orange-50/50" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-full" />
                )}
                <item.icon className={cn(
                  "mr-3 h-5 w-5 transition-colors", 
                  isActive ? "text-orange-500" : "text-slate-400 group-hover:text-slate-600"
                )} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Storage Indicator */}
      <div className="p-6 shrink-0 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Stockage Analytique</div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="text-xs font-medium text-slate-500">
            <span className="text-slate-800 font-bold">65%</span> - 8.2 TB / 12 TB
          </div>
        </div>
      </div>
    </aside>
  );
}
