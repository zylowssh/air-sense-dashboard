 import { useState, useEffect, useCallback } from 'react';
 import { backendConfig, checkFlaskHealth, isFlaskEnabled, getBackendForFeature, BackendConfig } from '@/lib/backendConfig';
 import { apiClient } from '@/lib/apiClient';
 import { supabase } from '@/integrations/supabase/client';
 
 export interface BackendStatus {
   flask: {
     enabled: boolean;
     healthy: boolean;
     checking: boolean;
   };
   supabase: {
     enabled: boolean;
     healthy: boolean;
     checking: boolean;
   };
 }
 
 /**
  * Hook to manage and monitor both backends
  */
 export const useBackend = () => {
   const [status, setStatus] = useState<BackendStatus>({
     flask: {
       enabled: isFlaskEnabled(),
       healthy: false,
       checking: true,
     },
     supabase: {
       enabled: true,
       healthy: false,
       checking: true,
     },
   });
 
   // Check Flask backend health
   const checkFlask = useCallback(async () => {
     if (!isFlaskEnabled()) {
       setStatus(prev => ({
         ...prev,
         flask: { ...prev.flask, checking: false, healthy: false },
       }));
       return;
     }
 
     setStatus(prev => ({
       ...prev,
       flask: { ...prev.flask, checking: true },
     }));
 
     const healthy = await checkFlaskHealth();
     setStatus(prev => ({
       ...prev,
       flask: { ...prev.flask, checking: false, healthy },
     }));
   }, []);
 
   // Check Supabase health
   const checkSupabase = useCallback(async () => {
     setStatus(prev => ({
       ...prev,
       supabase: { ...prev.supabase, checking: true },
     }));
 
     try {
       const { error } = await supabase.from('profiles').select('id').limit(1);
       setStatus(prev => ({
         ...prev,
         supabase: { ...prev.supabase, checking: false, healthy: !error },
       }));
     } catch {
       setStatus(prev => ({
         ...prev,
         supabase: { ...prev.supabase, checking: false, healthy: false },
       }));
     }
   }, []);
 
   // Check both backends on mount
   useEffect(() => {
     checkFlask();
     checkSupabase();
   }, [checkFlask, checkSupabase]);
 
   // Get the appropriate client for a feature
   const getClient = useCallback((feature: keyof BackendConfig['features']) => {
     const backend = getBackendForFeature(feature);
     
     if (backend === 'flask' && status.flask.healthy) {
       return { type: 'flask' as const, client: apiClient };
     }
     
     // Fallback to Supabase if Flask is not healthy
     return { type: 'supabase' as const, client: supabase };
   }, [status.flask.healthy]);
 
   return {
     status,
     checkFlask,
     checkSupabase,
     getClient,
     isFlaskEnabled: isFlaskEnabled(),
     config: backendConfig,
   };
 };