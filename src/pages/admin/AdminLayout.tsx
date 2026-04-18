import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/dev/login';
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-gold-500">Carregando...</div>;
  }

  if (!user && !isLoginPage) {
    return <Navigate to="/dev/login" replace />;
  }

  if (isLoginPage) {
    return <Outlet />;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-dark-800 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="font-display font-bold text-xl text-gold-500 uppercase tracking-wider">
            Painel Admin
          </h2>
          <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/dev" 
            className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-md border border-white/10"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            <Home size={18} />
            <span>Ver Site</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
