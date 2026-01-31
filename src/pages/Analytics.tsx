import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, BarChart, Bar } from 'recharts';
import { generate24HourData } from '@/lib/sensorData';
import { format } from 'date-fns';
import { useMemo } from 'react';

const Analytics = () => {
  const trendData = useMemo(() => generate24HourData(750), []);
  
  const chartData = trendData.map(reading => ({
    time: format(reading.timestamp, 'h a'),
    co2: reading.co2,
    temp: Math.round(reading.temperature * 10) / 10,
    humidity: Math.round(reading.humidity)
  }));

  // Weekly comparison data
  const weeklyData = [
    { day: 'Mon', avg: 780, peak: 1100 },
    { day: 'Tue', avg: 820, peak: 1250 },
    { day: 'Wed', avg: 750, peak: 980 },
    { day: 'Thu', avg: 800, peak: 1150 },
    { day: 'Fri', avg: 720, peak: 920 },
    { day: 'Sat', avg: 450, peak: 600 },
    { day: 'Sun', avg: 420, peak: 550 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.name === 'co2' ? 'ppm' : entry.name === 'temp' ? '°C' : '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout title="Analyses" subtitle="Analyse approfondie de vos données de qualité de l'air">
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['24h', '7d', '30d', 'Custom'].map((range) => (
              <Button
                key={range}
                variant={range === '24h' ? 'default' : 'outline'}
                size="sm"
                className={range === '24h' ? 'gradient-primary text-primary-foreground' : ''}
              >
                {range}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>

        {/* Multi-metric Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Métriques Environnementales</h2>
              <p className="text-sm text-muted-foreground">Tendances du CO₂, de la température et de l'humidité</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">CO₂</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-sm text-muted-foreground">Temp</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Humidité</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="co2AreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <YAxis 
                yAxisId="co2"
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                domain={[400, 1400]}
              />
              <YAxis 
                yAxisId="temp"
                orientation="right"
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                domain={[15, 35]}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                yAxisId="co2"
                type="monotone"
                dataKey="co2"
                stroke="none"
                fill="url(#co2AreaGradient)"
              />
              <Line
                yAxisId="co2"
                type="monotone"
                dataKey="co2"
                name="CO₂"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temp"
                name="Temperature"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Comparaison Hebdomadaire</h2>
              <p className="text-sm text-muted-foreground">Niveaux moyens vs pics de CO₂ par jour</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" name="Average" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="peak" name="Peak" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Temps dans la Bonne Plage', value: '78%', description: 'CO₂ en dessous de 800ppm', trend: '+5%' },
            { label: 'Pic Quotidien Moyen', value: '1,050 ppm', description: 'Habituellement vers 14h', trend: '-12%' },
            { label: 'Événements de Ventilation', value: '23', description: 'Fenêtres ouvertes cette semaine', trend: '+8' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 2) }}
              className="p-5 rounded-xl bg-card border border-border"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">{stat.description}</span>
                <span className="text-xs font-medium text-success">{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
