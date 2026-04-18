/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vxukibdoxknrkutiixec.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qIDwUwRK_z8Gn8h93bKfFg_zaDzA2it';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
