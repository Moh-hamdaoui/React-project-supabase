import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://URL.supabase.co';
const supabaseKey = 'Yourkey';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
