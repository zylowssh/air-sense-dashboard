import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, Plus, X, TrendingUp, TrendingDown } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { generateMockSensors, generate24HourData, getAirQualityLevel, Sensor } from '@/lib/sensorData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--success))'];

const Comparison = () => {
  const allSensors = generateMockSensors();
  const [selectedSensors, setSelectedSensors] = useState<string[]>([allSensors[0]?.id || '']);
  const [metric, setMetric] = useState<'co2' | 'temperature' | 'humidity'>('co2');

  const addSensor = () => {
    const availableSensors = allSensors.filter(s => !selectedSensors.includes(s.id));
    if (availableSensors.length > 0 && selectedSensors.length < 4) {
      setSelectedSensors([...selectedSensors, availableSensors[0].id]);
    }
  };

  const removeSensor = (sensorId: string) => {
    if (selectedSensors.length > 1) {
      setSelectedSensors(selectedSensors.filter(id => id !== sensorId));
    }
  };

  const updateSensor = (index: number, sensorId: string) => {
    const newSelected = [...selectedSensors];
    newSelected[index] = sensorId;
    setSelectedSensors(newSelected);
  };

  // Generate comparison data
  const comparisonData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (23 - i));
    
    const dataPoint: Record<string, any> = {
      time: hour.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    selectedSensors.forEach((sensorId, index) => {
      const sensor = allSensors.find(s => s.id === sensorId);
      if (sensor) {
        const baseValue = metric === 'co2' ? sensor.co2 : metric === 'temperature' ? sensor.temperature : sensor.humidity;
        const variation = (Math.random() - 0.5) * (metric === 'co2' ? 150 : metric === 'temperature' ? 2 : 10);
        dataPoint[sensor.name] = Math.round((baseValue + variation + (i * (Math.random() - 0.5) * 10)) * 10) / 10;
      }
    });

    return dataPoint;
  });

  const getMetricLabel = () => {
    switch (metric) {
      case 'co2': return 'CO₂ (ppm)';
      case 'temperature': return 'Température (°C)';
      case 'humidity': return 'Humidité (%)';
    }
  };

  const getSensorStats = (sensor: Sensor) => {
    const data = comparisonData;
    const values = data.map(d => d[sensor.name]).filter(v => v !== undefined);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const trend = values[values.length - 1] - values[0];

    return { avg: avg.toFixed(1), min: min.toFixed(1), max: max.toFixed(1), trend };
  };

  return (
    <AppLayout title="Comparaison" subtitle="Comparez les données de plusieurs capteurs">
      <div className="space-y-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="w-5 h-5" />
              Sélection des Capteurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              {selectedSensors.map((sensorId, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <Select value={sensorId} onValueChange={(v) => updateSensor(index, v)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allSensors.map(sensor => (
                        <SelectItem 
                          key={sensor.id} 
                          value={sensor.id}
                          disabled={selectedSensors.includes(sensor.id) && sensor.id !== sensorId}
                        >
                          {sensor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedSensors.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => removeSensor(sensorId)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {selectedSensors.length < 4 && selectedSensors.length < allSensors.length && (
                <Button variant="outline" size="sm" onClick={addSensor}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              )}

              <div className="ml-auto">
                <Select value={metric} onValueChange={(v: any) => setMetric(v)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="co2">CO₂</SelectItem>
                    <SelectItem value="temperature">Température</SelectItem>
                    <SelectItem value="humidity">Humidité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Évolution sur 24 Heures - {getMetricLabel()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={comparisonData}>
                    <defs>
                      {selectedSensors.map((sensorId, index) => {
                        const sensor = allSensors.find(s => s.id === sensorId);
                        return sensor ? (
                          <linearGradient key={sensor.id} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS[index]} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={COLORS[index]} stopOpacity={0} />
                          </linearGradient>
                        ) : null;
                      })}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="time" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    {selectedSensors.map((sensorId, index) => {
                      const sensor = allSensors.find(s => s.id === sensorId);
                      return sensor ? (
                        <Area
                          key={sensor.id}
                          type="monotone"
                          dataKey={sensor.name}
                          stroke={COLORS[index]}
                          fill={`url(#gradient-${index})`}
                          strokeWidth={2}
                        />
                      ) : null;
                    })}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sensor Stats Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedSensors.map((sensorId, index) => {
            const sensor = allSensors.find(s => s.id === sensorId);
            if (!sensor) return null;
            
            const stats = getSensorStats(sensor);
            const quality = getAirQualityLevel(sensor.co2);

            return (
              <motion.div
                key={sensor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4" style={{ borderLeftColor: COLORS[index] }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{sensor.name}</CardTitle>
                    <Badge variant={quality === 'bonne' || quality === 'excellente' ? 'default' : 'destructive'}>
                      {quality}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Moyenne</span>
                      <span className="font-semibold">{stats.avg}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Min / Max</span>
                      <span className="text-sm">{stats.min} / {stats.max}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tendance</span>
                      <span className={`flex items-center gap-1 text-sm ${stats.trend > 0 ? 'text-destructive' : 'text-success'}`}>
                        {stats.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {Math.abs(stats.trend).toFixed(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Comparison;
