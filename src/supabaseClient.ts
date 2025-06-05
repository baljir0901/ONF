import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbjqfoygnsaurldvcqxf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndianFmb3lnbnNhdXJsZHZjcXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDA0NDksImV4cCI6MjA2NDcxNjQ0OX0.fKkEtD4ZmA5CssdNCGTyGUk33mraWdjZ6j6x4R8DtXw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
