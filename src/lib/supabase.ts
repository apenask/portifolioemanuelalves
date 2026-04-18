/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safe production logging
if (import.meta.env.PROD) {
  console.log('Supabase Configuration Check:', {
    url: supabaseUrl ? 'Defined' : 'MISSING',
    keyPrefix: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 5)}...` : 'MISSING',
    environment: 'production'
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase environment variables are missing! Check your .env file or Netlify environment settings.');
  if (import.meta.env.PROD) {
    throw new Error('Supabase configuration failed. Please check build environment variables.');
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
