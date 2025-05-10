
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have the required configuration
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create client only if configured, otherwise return a mock client that shows errors
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Mock client to provide better error messages when Supabase isn't configured
function createMockClient() {
  const errorMessage = 'Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.';
  
  // Return a proxy object that shows helpful error messages instead of failing silently
  return new Proxy({}, {
    get: (target, prop) => {
      // For common methods, return functions that throw descriptive errors
      if (typeof prop === 'string') {
        return () => {
          console.error(errorMessage);
          throw new Error(errorMessage);
        };
      }
      return undefined;
    }
  });
}
