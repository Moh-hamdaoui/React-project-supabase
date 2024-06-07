import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gizswwotunfgnzvlnvgi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpenN3d290dW5mZ256dmxudmdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2NzE4MTUsImV4cCI6MjAzMzI0NzgxNX0.CqJFEDDoEWDm7MbrXSWyE8fvBL2KxZgnvONxHDZazLo';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
