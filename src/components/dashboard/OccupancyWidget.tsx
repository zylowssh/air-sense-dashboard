import { motion } from 'framer-motion';
import { Users, TrendingUp, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ZoneOccupancy {
  zone: string;
  current: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
}

// Mock occupancy data
const zones: ZoneOccupancy[] = [
  { zone: 'Bureau Principal', current: 12, max: 20, trend: 'up' },
  { zone: 'Salle de réunion', current: 6, max: 10, trend: 'stable' },
  { zone: 'Open Space', current: 18, max: 30, trend: 'down' },
];

export function OccupancyWidget() {
  const totalOccupancy = zones.reduce((acc, z) => acc + z.current, 0);
  const totalCapacity = zones.reduce((acc, z) => acc + z.max, 0);
  const overallPercent = Math.round((totalOccupancy / totalCapacity) * 100);

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
        <Users className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Occupation</h3>
        <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium">
          {totalOccupancy}/{totalCapacity}
        </span>
      </div>

      {/* Overall bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">Taux global</span>
          <span className={cn(
            'text-xs font-medium',
            overallPercent > 80 ? 'text-amber-500' : 'text-primary'
          )}>
            {overallPercent}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPercent}%` }}
            transition={{ duration: 0.8 }}
            className={cn(
              'h-full rounded-full',
              overallPercent > 80 ? 'bg-amber-500' : 'bg-primary'
            )}
          />
        </div>
      </div>

      {/* Zone breakdown */}
      <div className="space-y-2">
        {zones.map((zone, index) => {
          const percent = Math.round((zone.current / zone.max) * 100);
          return (
            <motion.div
              key={zone.zone}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-foreground flex-1 truncate">{zone.zone}</span>
              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    'h-full rounded-full transition-all',
                    percent > 80 ? 'bg-amber-500' : 'bg-primary/70'
                  )}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">
                {zone.current}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Mise à jour en temps réel</span>
      </div>
    </motion.div>
  );
}
