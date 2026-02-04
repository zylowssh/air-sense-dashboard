import { motion } from 'framer-motion';
import { Brain, TrendingUp, Zap, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Prediction {
  id: string;
  title: string;
  likelihood: number;
  timeframe: string;
  impact: 'low' | 'medium' | 'high';
}

// Mock predictions data
const predictions: Prediction[] = [
  { id: '1', title: 'Pic CO2 prévu', likelihood: 78, timeframe: '14h-16h', impact: 'medium' },
  { id: '2', title: 'Ventilation insuffisante', likelihood: 65, timeframe: 'Demain matin', impact: 'high' },
  { id: '3', title: 'Stabilité température', likelihood: 92, timeframe: 'Aujourd\'hui', impact: 'low' },
];

export function PredictiveAlertsWidget() {
  const getImpactColor = (impact: Prediction['impact']) => {
    switch (impact) {
      case 'low': return 'text-emerald-500';
      case 'medium': return 'text-amber-500';
      case 'high': return 'text-rose-500';
    }
  };

  const getProgressColor = (impact: Prediction['impact']) => {
    switch (impact) {
      case 'low': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'high': return 'bg-rose-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border border-border p-4 overflow-hidden',
        'bg-card/50 backdrop-blur-sm'
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Alertes Prédictives</h3>
        <span className="ml-auto px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary font-medium">
          IA
        </span>
      </div>

      <div className="space-y-3">
        {predictions.map((prediction, index) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className={cn('h-3.5 w-3.5', getImpactColor(prediction.impact))} />
                <span className="text-xs font-medium text-foreground">{prediction.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{prediction.timeframe}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.likelihood}%` }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  className={cn('h-full rounded-full', getProgressColor(prediction.impact))}
                />
              </div>
              <span className={cn('text-xs font-medium', getImpactColor(prediction.impact))}>
                {prediction.likelihood}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info className="h-3 w-3" />
        <span>Basé sur l'historique des 30 derniers jours</span>
      </div>
    </motion.div>
  );
}
