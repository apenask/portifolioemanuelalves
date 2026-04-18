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

const parseJwtPayload = (token?: string): Record<string, unknown> | null => {
  if (!token || !token.includes('.')) return null;

  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = atob(base64);
    return JSON.parse(payload);
  } catch {
    return null;
  }
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

const keyPayload = parseJwtPayload(supabaseAnonKey);
const keyRole = typeof keyPayload?.role === 'string' ? keyPayload.role : null;
const looksLikeJwt = Boolean(supabaseAnonKey?.split('.').length === 3);

if (import.meta.env.PROD) {
  console.log('Supabase Configuration Check:', {
    url: supabaseUrl ? 'Defined' : 'MISSING',
    keyPrefix: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 8)}...` : 'MISSING',
    keyRole: keyRole || 'unknown',
    looksLikeJwt,
    environment: 'production'
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase config ausente: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ambiente de build/deploy.'
  );
}

if (!looksLikeJwt) {
  throw new Error(
    'Supabase ANON KEY inválida: o valor não parece um JWT. Verifique se copiou a chave completa em Settings > API.'
  );
}

if (keyRole && keyRole !== 'anon') {
  console.warn(
    `Supabase key role detectada como "${keyRole}". Para o frontend público, use a chave ANON (role=anon).`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseDebugResult {
  env: {
    hasUrl: boolean;
    hasKey: boolean;
    keyPrefix: string;
    keyRole: string;
    looksLikeJwt: boolean;
  };
  request: {
    table: string;
    ok: boolean;
    statusCode: string | null;
    message: string | null;
    details: unknown;
  };
}

export const runSupabaseDebug = async (): Promise<SupabaseDebugResult> => {
  const { error } = await supabase.from('athlete_profile').select('id').limit(1);

  const result: SupabaseDebugResult = {
    env: {
      hasUrl: Boolean(supabaseUrl),
      hasKey: Boolean(supabaseAnonKey),
      keyPrefix: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 8)}...` : 'missing',
      keyRole: keyRole || 'unknown',
      looksLikeJwt
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
