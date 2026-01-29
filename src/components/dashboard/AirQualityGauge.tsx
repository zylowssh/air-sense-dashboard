import { motion } from 'framer-motion';
import { getAirQualityLevel, getAirQualityColor } from '@/lib/sensorData';
import { cn } from '@/lib/utils';

interface AirQualityGaugeProps {
  co2: number;
  size?: number;
}

export function AirQualityGauge({ co2, size = 200 }: AirQualityGaugeProps) {
  const level = getAirQualityLevel(co2);
  const colorClass = getAirQualityColor(level);
  
  // Calculate percentage (0-2000 ppm range)
  const percentage = Math.min(100, (co2 / 2000) * 100);
  
  // Calculate stroke dash offset for the arc
  const radius = (size - 20) / 2;
  const circumference = radius * Math.PI * 1.5; // 270 degrees arc
  const offset = circumference - (percentage / 100) * circumference;
  
  const getArcColor = () => {
    if (co2 < 600) return 'stroke-success';
    if (co2 < 800) return 'stroke-primary';
    if (co2 < 1000) return 'stroke-warning';
    return 'stroke-destructive';
  };

  const getMessage = () => {
    switch (level) {
      case 'excellent': return 'Excellent air quality';
      case 'good': return 'Good air quality';
      case 'moderate': return 'Consider improving ventilation';
      case 'poor': return 'Open windows recommended';
      case 'hazardous': return 'Immediate action needed';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size * 0.85 }}>
        <svg 
          width={size} 
          height={size * 0.85} 
          viewBox={`0 0 ${size} ${size * 0.85}`}
          className="transform -rotate-90"
        >
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth="12"
            className="stroke-muted"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            transform={`rotate(135, ${size / 2}, ${size / 2})`}
          />
          
          {/* Value arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth="12"
            className={cn(getArcColor(), "drop-shadow-lg")}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset + circumference * 0.25 }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
            transform={`rotate(135, ${size / 2}, ${size / 2})`}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-5xl font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {co2}
          </motion.span>
          <span className="text-lg text-muted-foreground font-medium">PPM</span>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <div className="flex items-center justify-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", colorClass.replace('text-', 'bg-'))} />
          <span className={cn("font-semibold capitalize", colorClass)}>{level}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{getMessage()}</p>
      </div>
    </div>
  );
}
