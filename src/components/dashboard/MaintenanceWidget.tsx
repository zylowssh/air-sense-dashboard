import { motion } from 'framer-motion';
import { Wrench, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaintenanceItem {
  id: string;
  sensorName: string;
  type: 'scheduled' | 'required' | 'completed';
  date: string;
  description: string;
}

// Mock data for upcoming/recent maintenance
const maintenanceItems: MaintenanceItem[] = [
  { id: '1', sensorName: 'Bureau Principal', type: 'scheduled', date: 'Dans 5 jours', description: 'Calibration CO2' },
  { id: '2', sensorName: 'Salle des serveurs', type: 'required', date: 'Urgent', description: 'Remplacement filtre' },
  { id: '3', sensorName: 'Salle Alpha', type: 'completed', date: 'Il y a 2 jours', description: 'Vérification batterie' },
];

export function MaintenanceWidget() {
  const getIcon = (type: MaintenanceItem['type']) => {
    switch (type) {
      case 'scheduled': return <Calendar className="h-4 w-4 text-primary" />;
      case 'required': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    }
  };

  const getStatusColor = (type: MaintenanceItem['type']) => {
    switch (type) {
      case 'scheduled': return 'border-primary/30 bg-primary/5';
      case 'required': return 'border-amber-500/30 bg-amber-500/5';
      case 'completed': return 'border-emerald-500/30 bg-emerald-500/5';
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
        <Wrench className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Maintenance</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          <Clock className="h-3 w-3 inline mr-1" />
          Prochaine: 5j
        </span>
      </div>

      <div className="space-y-2">
        {maintenanceItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'flex items-center gap-3 p-2.5 rounded-lg border',
              getStatusColor(item.type)
            )}
          >
            {getIcon(item.type)}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {item.sensorName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {item.date}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
