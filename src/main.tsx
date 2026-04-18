import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { DataProvider } from './context/DataContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { runSupabaseDebug } from './lib/supabase.ts';
import './index.css';

declare global {
  interface Window {
    debugSupabase?: typeof runSupabaseDebug;
  }
}

if (typeof window !== 'undefined') {
  window.debugSupabase = runSupabaseDebug;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
