import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Sensor, Reading } from '@/lib/sensorData';

interface DatabaseSensor {
  id: string;
  user_id: string;
  name: string;
  location: string;
  status: string;
  sensor_type: string;
  battery: number | null;
  is_live: boolean | null;
  created_at: string;
  updated_at: string;
}

interface DatabaseReading {
  id: string;
  sensor_id: string;
  co2: number;
  temperature: number;
  humidity: number;
  recorded_at: string;
}

export const useSensors = () => {
  const { user } = useAuth();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensors = useCallback(async () => {
    if (!user) {
      setSensors([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('sensors')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const mappedSensors: Sensor[] = (data as DatabaseSensor[]).map((s) => ({
        id: s.id,
        name: s.name,
        location: s.location,
        status: s.status as 'en ligne' | 'hors ligne' | 'avertissement',
        co2: 0,
        temperature: 0,
        humidity: 0,
        lastReading: new Date(s.updated_at),
        battery: s.battery ?? undefined,
        isLive: s.is_live ?? true,
      }));

      // Fetch latest readings for each sensor
      for (const sensor of mappedSensors) {
        const { data: readings } = await supabase
          .from('sensor_readings')
          .select('*')
          .eq('sensor_id', sensor.id)
          .order('recorded_at', { ascending: false })
          .limit(1);

        if (readings && readings.length > 0) {
          const reading = readings[0] as DatabaseReading;
          sensor.co2 = Number(reading.co2);
          sensor.temperature = Number(reading.temperature);
          sensor.humidity = Number(reading.humidity);
          sensor.lastReading = new Date(reading.recorded_at);
        }
      }

      setSensors(mappedSensors);
    } catch (err) {
      console.error('Error fetching sensors:', err);
      setError('Erreur lors du chargement des capteurs');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSensors();
  }, [fetchSensors]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('sensor_readings_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings',
        },
        (payload) => {
          const newReading = payload.new as DatabaseReading;
          setSensors((prev) =>
            prev.map((sensor) =>
              sensor.id === newReading.sensor_id
                ? {
                    ...sensor,
                    co2: Number(newReading.co2),
                    temperature: Number(newReading.temperature),
                    humidity: Number(newReading.humidity),
                    lastReading: new Date(newReading.recorded_at),
                  }
                : sensor
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const createSensor = async (
    name: string,
    location: string,
    sensorType: 'real' | 'simulation'
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('sensors')
        .insert({
          user_id: user.id,
          name,
          location,
          sensor_type: sensorType,
          status: 'en ligne',
        })
        .select()
        .single();

      if (error) throw error;

      await fetchSensors();
      return data;
    } catch (err) {
      console.error('Error creating sensor:', err);
      throw err;
    }
  };

  const updateSensor = async (
    sensorId: string,
    updates: { name?: string; location?: string; sensor_type?: 'real' | 'simulation' }
  ) => {
    try {
      const { error } = await supabase
        .from('sensors')
        .update(updates)
        .eq('id', sensorId);

      if (error) throw error;

      await fetchSensors();
    } catch (err) {
      console.error('Error updating sensor:', err);
      throw err;
    }
  };

  const deleteSensor = async (sensorId: string) => {
    try {
      const { error } = await supabase
        .from('sensors')
        .delete()
        .eq('id', sensorId);

      if (error) throw error;

      setSensors((prev) => prev.filter((s) => s.id !== sensorId));
    } catch (err) {
      console.error('Error deleting sensor:', err);
      throw err;
    }
  };

  const addReading = async (
    sensorId: string,
    reading: { co2: number; temperature: number; humidity: number }
  ) => {
    try {
      const { error } = await supabase.from('sensor_readings').insert({
        sensor_id: sensorId,
        co2: reading.co2,
        temperature: reading.temperature,
        humidity: reading.humidity,
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error adding reading:', err);
      throw err;
    }
  };

  return {
    sensors,
    isLoading,
    error,
    fetchSensors,
    createSensor,
    updateSensor,
    deleteSensor,
    addReading,
  };
};
