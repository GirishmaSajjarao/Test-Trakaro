
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cfbpeaozbyaptsonrezx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYnBlYW96YnlhcHRzb25yZXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDY4MDIsImV4cCI6MjA2MzQ4MjgwMn0.71lorFSg_MCxbIWQSZDC--CJsdlFBHs0xChxKxyHvRw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
