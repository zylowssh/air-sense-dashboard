import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate realistic CO2 patterns based on time of day
function generateCO2Pattern(hour: number, baseValue: number): number {
  const patterns: Record<number, number> = {
    0: -200, 1: -220, 2: -230, 3: -240, 4: -230, 5: -200,
    6: -150, 7: -50, 8: 50, 9: 150, 10: 200, 11: 250,
    12: 200, 13: 250, 14: 300, 15: 280, 16: 250, 17: 150,
    18: 50, 19: -50, 20: -100, 21: -150, 22: -180, 23: -190
  };
  
  const variation = (Math.random() - 0.5) * 100;
  return Math.max(350, baseValue + (patterns[hour] || 0) + variation);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get all simulation sensors
    const { data: sensors, error: sensorsError } = await supabase
      .from('sensors')
      .select('*')
      .eq('sensor_type', 'simulation')
      .eq('is_live', true);

    if (sensorsError) {
      console.error("Error fetching sensors:", sensorsError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération des capteurs' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!sensors || sensors.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Aucun capteur de simulation actif', count: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const hour = now.getHours();
    const results = [];

    for (const sensor of sensors) {
      // Get last reading for this sensor
      const { data: lastReading } = await supabase
        .from('sensor_readings')
        .select('co2, temperature, humidity')
        .eq('sensor_id', sensor.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      // Calculate new values based on last reading or defaults
      const baseCO2 = lastReading?.co2 || 700;
      const baseTemp = lastReading?.temperature || 22;
      const baseHumidity = lastReading?.humidity || 50;

      // Generate realistic variations
      const co2Variation = (Math.random() - 0.5) * 30;
      const tempVariation = (Math.random() - 0.5) * 0.5;
      const humidityVariation = (Math.random() - 0.5) * 3;

      const newReading = {
        sensor_id: sensor.id,
        co2: Math.round(Math.max(350, Math.min(2000, generateCO2Pattern(hour, Number(baseCO2))))),
        temperature: Math.round((Number(baseTemp) + tempVariation) * 10) / 10,
        humidity: Math.round(Math.max(20, Math.min(80, Number(baseHumidity) + humidityVariation))),
      };

      // Insert new reading
      const { error: insertError } = await supabase
        .from('sensor_readings')
        .insert(newReading);

      if (insertError) {
        console.error(`Error inserting reading for sensor ${sensor.id}:`, insertError);
        continue;
      }

      // Determine sensor status based on CO2 level
      let status = 'en ligne';
      if (newReading.co2 > 1000) {
        status = 'avertissement';
      }

      // Update sensor status
      await supabase
        .from('sensors')
        .update({ 
          status,
          updated_at: now.toISOString()
        })
        .eq('id', sensor.id);

      results.push({
        sensor_name: sensor.name,
        ...newReading,
        status,
      });

      console.log(`Simulated reading for ${sensor.name}:`, newReading);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Simulations générées', 
        count: results.length,
        readings: results,
        timestamp: now.toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
