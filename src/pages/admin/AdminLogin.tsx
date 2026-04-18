import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dev');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/dev');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="glass-panel p-8 max-w-md w-full rounded-lg border border-white/10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/30">
            <Lock className="text-gold-500" size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-display font-bold text-center text-white mb-2 uppercase tracking-wider">
          Acesso Restrito
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          Área administrativa do atleta.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              E-mail
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="admin@exemplo.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Senha de Acesso
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="••••••••"
              required
            />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold uppercase tracking-wider py-3 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  );
}
