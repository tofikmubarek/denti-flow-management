
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables or use fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have the required configuration
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create client only if configured, otherwise return a mock client that shows errors
export const supabase: SupabaseClient = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Mock client to provide better error messages when Supabase isn't configured
function createMockClient(): SupabaseClient {
  const errorMessage = 'Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.';
  
  // Create a base mock handler that we'll use for all function calls
  const mockHandler = {
    apply: (target: any, thisArg: any, args: any[]): any => {
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Create a recursive proxy that can handle any property chain
  const createRecursiveProxy = (): any => {
    return new Proxy(() => {}, {
      get: (target, prop) => {
        // Return a new proxy for any property access
        return createRecursiveProxy();
      },
      apply: (target, thisArg, args) => {
        // Throw the error when any function is called
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    });
  };

  // Create the base proxy that mimics the SupabaseClient structure
  return new Proxy({} as any, {
    get: (target, prop) => {
      // Handle common Supabase methods by returning a function that throws
      if (typeof prop === 'string') {
        return createRecursiveProxy();
      }
      return undefined;
    }
  }) as SupabaseClient;
}
