import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://umtmjabmbbchxyvfrzrj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_edmE-mnVn581ArJNJCuKqw__O7OBWaX';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
