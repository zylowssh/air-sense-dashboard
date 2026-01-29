import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface KPICardProps {
  label: string;
  value: number | string;
  unit?: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  status?: 'default' | 'success' | 'warning' | 'danger';
}

export function KPICard({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  trendLabel,
  status = 'default' 
}: KPICardProps) {
  const statusColors = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive'
  };

  const iconBgColors = {
    default: 'bg-primary/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    danger: 'bg-destructive/10'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={cn("p-2 rounded-lg", iconBgColors[status])}>
          <Icon className={cn("w-4 h-4", statusColors[status])} />
        </div>
      </div>
      
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold text-foreground">{value}</span>
        {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          {trend >= 0 ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive" />
          )}
          <span className={cn("text-sm font-medium", trend >= 0 ? "text-success" : "text-destructive")}>
            {Math.abs(trend)}%
          </span>
          <span className="text-sm text-muted-foreground">{trendLabel || 'vs yesterday'}</span>
        </div>
      )}
    </motion.div>
  );
}
