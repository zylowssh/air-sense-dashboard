import { motion } from 'framer-motion';
import { MapPin, Thermometer, Droplets, Activity } from 'lucide-react';
import { Sensor, getAirQualityLevel } from '@/lib/sensorData';
import { cn } from '@/lib/utils';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SensorCardProps {
  sensor: Sensor;
  miniChartData?: number[];
}

export function SensorCard({ sensor, miniChartData }: SensorCardProps) {
  const level = getAirQualityLevel(sensor.co2);
  
  const statusColors = {
    online: 'bg-success text-success',
    offline: 'bg-muted-foreground text-muted-foreground',
    warning: 'bg-warning text-warning'
  };

  const chartData = miniChartData?.map((value, index) => ({ value, index })) || [];
  
  const getChartColor = () => {
    if (sensor.co2 < 800) return 'hsl(var(--primary))';
    if (sensor.co2 < 1000) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {sensor.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{sensor.location}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={cn(
            "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border",
            sensor.status === 'online' 
              ? "bg-success/10 border-success/30 text-success"
              : sensor.status === 'warning'
              ? "bg-warning/10 border-warning/30 text-warning"
              : "bg-muted border-muted-foreground/30 text-muted-foreground"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", statusColors[sensor.status].split(' ')[0])} />
            {sensor.status === 'online' ? 'En Ligne' : sensor.status === 'warning' ? 'Avertissement' : 'Hors Ligne'}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-3xl font-bold",
              sensor.co2 < 800 ? "text-primary" : sensor.co2 < 1000 ? "text-warning" : "text-destructive"
            )}>
              {sensor.co2}
            </span>
            <span className="text-sm text-muted-foreground">ppm</span>
          </div>
          
          {sensor.isLive && (
            <div className="flex items-center gap-1.5 mt-1">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">LIVE</span>
            </div>
          )}
        </div>

        {chartData.length > 0 && (
          <div className="w-24 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={getChartColor()}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-sm">
          <Thermometer className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">{sensor.temperature}°C</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Droplets className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Humidité</span>
          <span className="text-foreground font-medium">{sensor.humidity}%</span>
        </div>
      </div>
    </motion.div>
  );
}
