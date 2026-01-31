import { Radio, Activity, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickInsightsProps {
  sensorsOnline: number;
  totalSensors: number;
  readingsToday: number;
  peakCO2: number;
  bestAirTime: string;
}

export function QuickInsights({
  sensorsOnline,
  totalSensors,
  readingsToday,
  peakCO2,
  bestAirTime
}: QuickInsightsProps) {
  const insights = [
    {
      label: 'Capteurs En Ligne',
      value: `${sensorsOnline}/${totalSensors}`,
      icon: Radio
    },
    {
      label: 'Lectures Aujourd\'hui',
      value: readingsToday.toString(),
      icon: Activity
    },
    {
      label: 'Pic CO₂ Aujourd\'hui',
      value: `${peakCO2.toLocaleString()} ppm`,
      icon: TrendingUp,
      highlight: true
    },
    {
      label: 'Meilleur Moment d\'Air',
      value: bestAirTime,
      icon: Clock,
      accent: true
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl bg-card border border-border"
    >
      <h3 className="text-base font-semibold text-foreground mb-4">Aperçus Rapides</h3>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <insight.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{insight.label}</span>
            </div>
            <span className={`text-sm font-semibold ${
              insight.highlight ? 'text-warning' : 
              insight.accent ? 'text-primary' : 
              'text-foreground'
            }`}>
              {insight.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
