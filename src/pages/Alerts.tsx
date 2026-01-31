import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, XCircle, Clock, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateMockAlerts, Alert } from '@/lib/sensorData';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(() => [
    ...generateMockAlerts(),
    {
      id: 'alert-3',
      sensorId: 'sensor-1',
      sensorName: 'Main Office',
      type: 'critical',
      message: 'Critical CO₂ level exceeded',
      value: 1250,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'acknowledged'
    },
    {
      id: 'alert-4',
      sensorId: 'sensor-2',
      sensorName: 'Meeting Room Alpha',
      type: 'info',
      message: 'Sensor back online',
      value: 650,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'resolved'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'new' | 'acknowledged' | 'resolved'>('all');

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' ? true : alert.status === filter
  );

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'acknowledged' as const } : a
    ));
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'resolved' as const } : a
    ));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'critical': return XCircle;
      case 'info': return Bell;
    }
  };

  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning' };
      case 'critical': return { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive' };
      case 'info': return { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary' };
    }
  };

  return (
    <AppLayout title="Alertes" subtitle="Surveiller et gérer les alertes de qualité de l'air">
      <div className="space-y-6">
        {/* Filter Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(['all', 'new', 'acknowledged', 'resolved'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className={filter === f ? 'gradient-primary text-primary-foreground' : ''}
              >
                {f.charAt(0).toUpperCase() + f.slice(1) === 'All' ? 'Toutes' :
                 f.charAt(0).toUpperCase() + f.slice(1) === 'New' ? 'Nouvelles' :
                 f.charAt(0).toUpperCase() + f.slice(1) === 'Acknowledged' ? 'Reconnu' :
                 f.charAt(0).toUpperCase() + f.slice(1) === 'Resolved' ? 'Résolues' :
                 f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'new' && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-destructive/20 text-destructive rounded-full text-xs">
                    {alerts.filter(a => a.status === 'new').length}
                  </span>
                )}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter une Règle
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total des Alertes', value: alerts.length, icon: Bell },
            { label: 'Nouvelles', value: alerts.filter(a => a.status === 'new').length, color: 'text-destructive' },
            { label: 'Reconnues', value: alerts.filter(a => a.status === 'acknowledged').length, color: 'text-warning' },
            { label: 'Résolues', value: alerts.filter(a => a.status === 'resolved').length, color: 'text-success' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={cn("text-2xl font-bold mt-1", stat.color || 'text-foreground')}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert, index) => {
            const Icon = getAlertIcon(alert.type);
            const styles = getAlertStyles(alert.type);

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className={cn(
                  "p-4 rounded-xl border bg-card",
                  alert.status === 'new' ? styles.border : 'border-border'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-2.5 rounded-lg", styles.bg)}>
                    <Icon className={cn("w-5 h-5", styles.text)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-medium text-foreground">{alert.sensorName}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {alert.message}: <span className="font-medium text-foreground">{alert.value}ppm</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {alert.status === 'new' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                              Reconnaître
                            </Button>
                            <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => resolveAlert(alert.id)}>
                              Résoudre
                            </Button>
                          </>
                        )}
                        {alert.status === 'acknowledged' && (
                          <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => resolveAlert(alert.id)}>
                            Resolve
                          </Button>
                        )}
                        {alert.status === 'resolved' && (
                          <span className="flex items-center gap-1.5 text-sm text-success">
                            <CheckCircle className="w-4 h-4" />
                            Résolue
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full border",
                        alert.status === 'new' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                        alert.status === 'acknowledged' ? 'bg-warning/10 border-warning/30 text-warning' :
                        'bg-success/10 border-success/30 text-success'
                      )}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1) === 'New' ? 'Nouvelle' :
                        alert.status.charAt(0).toUpperCase() + alert.status.slice(1) === 'Acknowledged' ? 'Reconnue' :
                        alert.status.charAt(0).toUpperCase() + alert.status.slice(1) === 'Resolved' ? 'Résolue' :
                        alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Alerts;
