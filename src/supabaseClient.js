import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://mxrjnfqqastxrgkhbdsd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14cmpuZnFxYXN0eHJna2hiZHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTM1NjEsImV4cCI6MjA5MTgyOTU2MX0.-alP0q5kuysL0x3zH3Iw6QdGNu1eC1MdBR3bCAEx7Zo';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
