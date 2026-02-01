import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SensorReading {
  sensor_id: string;
  co2: number;
  temperature: number;
  humidity: number;
  api_key?: string;
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
    // Check if this is a WebSocket upgrade request
    const upgrade = req.headers.get("upgrade") || "";
    
    if (upgrade.toLowerCase() === "websocket") {
      // Handle WebSocket connection
      const { socket, response } = Deno.upgradeWebSocket(req);
      
      console.log("WebSocket connection established");
      
      socket.onopen = () => {
        console.log("WebSocket opened");
        socket.send(JSON.stringify({ 
          type: 'connected', 
          message: 'Connecté au serveur Aerium' 
        }));
      };
      
      socket.onmessage = async (event) => {
        try {
          const data: SensorReading = JSON.parse(event.data);
          console.log("Received sensor data:", data);
          
          // Validate required fields
          if (!data.sensor_id || data.co2 === undefined || 
              data.temperature === undefined || data.humidity === undefined) {
            socket.send(JSON.stringify({ 
              type: 'error', 
              message: 'Données manquantes: sensor_id, co2, temperature, humidity requis' 
            }));
            return;
          }
          
          // Verify sensor exists
          const { data: sensor, error: sensorError } = await supabase
            .from('sensors')
            .select('id, sensor_type')
            .eq('id', data.sensor_id)
            .single();
          
          if (sensorError || !sensor) {
            socket.send(JSON.stringify({ 
              type: 'error', 
              message: 'Capteur non trouvé' 
            }));
            return;
          }
          
          // Insert reading
          const { error: insertError } = await supabase
            .from('sensor_readings')
            .insert({
              sensor_id: data.sensor_id,
              co2: data.co2,
              temperature: data.temperature,
              humidity: data.humidity,
            });
          
          if (insertError) {
            console.error("Insert error:", insertError);
            socket.send(JSON.stringify({ 
              type: 'error', 
              message: 'Erreur lors de l\'enregistrement des données' 
            }));
            return;
          }
          
          // Update sensor status
          await supabase
            .from('sensors')
            .update({ 
              status: 'en ligne',
              updated_at: new Date().toISOString()
            })
            .eq('id', data.sensor_id);
          
          socket.send(JSON.stringify({ 
            type: 'success', 
            message: 'Données enregistrées',
            timestamp: new Date().toISOString()
          }));
          
        } catch (err) {
          console.error("Error processing message:", err);
          socket.send(JSON.stringify({ 
            type: 'error', 
            message: 'Erreur de traitement des données' 
          }));
        }
      };
      
      socket.onclose = () => {
        console.log("WebSocket closed");
      };
      
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      
      return response;
    }
    
    // Handle regular HTTP POST for sensors that can't use WebSocket
    if (req.method === 'POST') {
      const data: SensorReading = await req.json();
      console.log("Received HTTP sensor data:", data);
      
      // Validate required fields
      if (!data.sensor_id || data.co2 === undefined || 
          data.temperature === undefined || data.humidity === undefined) {
        return new Response(
          JSON.stringify({ error: 'Données manquantes: sensor_id, co2, temperature, humidity requis' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Verify sensor exists
      const { data: sensor, error: sensorError } = await supabase
        .from('sensors')
        .select('id, sensor_type')
        .eq('id', data.sensor_id)
        .single();
      
      if (sensorError || !sensor) {
        return new Response(
          JSON.stringify({ error: 'Capteur non trouvé' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Insert reading
      const { error: insertError } = await supabase
        .from('sensor_readings')
        .insert({
          sensor_id: data.sensor_id,
          co2: data.co2,
          temperature: data.temperature,
          humidity: data.humidity,
        });
      
      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'enregistrement des données' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Update sensor status
      await supabase
        .from('sensors')
        .update({ 
          status: 'en ligne',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.sensor_id);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Données enregistrées', timestamp: new Date().toISOString() }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // GET request - return API documentation
    return new Response(
      JSON.stringify({
        name: 'Aerium Sensor API',
        version: '1.0.0',
        description: 'API pour les capteurs SDC30',
        endpoints: {
          websocket: 'wss://sqmllvsasvmvqhmpwfdz.functions.supabase.co/sensor-websocket',
          http_post: 'POST /sensor-websocket',
        },
        payload: {
          sensor_id: 'UUID du capteur',
          co2: 'Valeur CO2 en ppm (number)',
          temperature: 'Température en °C (number)',
          humidity: 'Humidité en % (number)',
        },
        example: {
          sensor_id: '123e4567-e89b-12d3-a456-426614174000',
          co2: 750,
          temperature: 23.5,
          humidity: 55,
        }
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
