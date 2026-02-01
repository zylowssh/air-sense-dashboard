import { AlertTriangle, Clock, Radio } from 'lucide-react';
import { Alert } from '@/lib/sensorData';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

export interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const typeStyles = {
    avertissement: {
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      icon: 'text-warning',
      badge: 'bg-warning/20 text-warning'
    },
    critique: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      icon: 'text-destructive',
      badge: 'bg-destructive/20 text-destructive'
    },
    info: {
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      icon: 'text-primary',
      badge: 'bg-primary/20 text-primary'
    }
  };

  const style = typeStyles[alert.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "p-4 rounded-lg border",
        style.bg,
        style.border
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", style.bg)}>
          <AlertTriangle className={cn("w-4 h-4", style.icon)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-foreground truncate">{alert.sensorName}</h4>
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0",
              alert.status === 'nouvelle' ? style.badge : "bg-muted text-muted-foreground"
            )}>
              {alert.status === 'nouvelle' ? 'En Ligne' : 'Reconnue'}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">
            {alert.message}: <span className="font-medium text-foreground">{alert.value}ppm</span>
          </p>
          
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
