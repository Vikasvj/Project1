import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cykrbzirrsoqyycniqho.supabase.co';
const supabaseAnonKey = 'sb_publishable_dxbf8o29Bbr5CQzoPrRYkg_O-UUi38A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);