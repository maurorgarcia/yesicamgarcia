import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bpmjmqcyzjfnqzuxokup.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbWptcWN5empmbnF6dXhva3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTI0MTYsImV4cCI6MjA5MjQ2ODQxNn0.Z0cFtPVjUrCHf_F9b1Q3YEgTzMlGFp_GBwxbtoU1YzY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
