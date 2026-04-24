import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar fixed on the left */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        
        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
