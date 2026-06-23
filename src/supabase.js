import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdhntqsabwcbulnapfcg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaG50cXNhYndjYnVsbmFwZmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjYyNDYsImV4cCI6MjA5NTUwMjI0Nn0.8YqiYDidhvZc-n0VInSPy0XxvqYFgWz5fEijnDh6K_o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);