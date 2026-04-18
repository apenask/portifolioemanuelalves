/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const sanitizeEnvVar = (value?: string) => {
  if (!value) return value;
  const trimmed = value.trim();
  return trimmed.replace(/^['"](.*)['"]$/, '$1').trim();
};

const resolveEnvVar = (...keys: string[]) => {
  for (const key of keys) {
    const value = sanitizeEnvVar(import.meta.env[key]);
    if (value) return value;
  }
  return undefined;
};

const supabaseUrl = resolveEnvVar(
  'VITE_SUPABASE_URL',
  'VITE_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL'
);

const supabaseAnonKey = resolveEnvVar(
  'VITE_SUPABASE_ANON_KEY',
  'VITE_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
);

// Safe production logging
if (import.meta.env.PROD) {
  console.log('Supabase Configuration Check:', {
    url: supabaseUrl ? 'Defined' : 'MISSING',
    keyPrefix: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 8)}...` : 'MISSING',
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

declare global {
  interface Window {
    debugSupabase?: () => Promise<{
      env: {
        hasUrl: boolean;
        hasKey: boolean;
        keyPrefix: string;
      };
      request: {
        table: string;
        ok: boolean;
        statusCode: string | null;
        message: string | null;
        details: unknown;
      };
    }>;
  }
}

if (typeof window !== 'undefined') {
  window.debugSupabase = async () => {
    const { error } = await supabase.from('athlete_profile').select('id').limit(1);

    const result = {
      env: {
        hasUrl: Boolean(supabaseUrl),
        hasKey: Boolean(supabaseAnonKey),
        keyPrefix: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 8)}...` : 'missing'
      },
      request: {
        table: 'athlete_profile',
        ok: !error,
        statusCode: error?.code ?? null,
        message: error?.message ?? null,
        details: error?.details ?? null
      }
    };

    console.log('Supabase debug result:', result);
    return result;
  };
}
