import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Activity, Heart } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { AirQualityOverviewCard } from '@/components/dashboard/AirQualityOverviewCard';
import { SensorCard } from '@/components/dashboard/SensorCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { QuickInsights } from '@/components/dashboard/QuickInsights';
import { 
  generateMockSensors, 
  generate24HourData, 
  generateMockAlerts,
  simulateSensorUpdate,
  getHealthScore,
  Sensor
} from '@/lib/sensorData';

const Dashboard = () => {
  const [sensors, setSensors] = useState<Sensor[]>(() => generateMockSensors());
  const [trendData] = useState(() => generate24HourData(700));
  const [alerts] = useState(() => generateMockAlerts());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate aggregate metrics
  const avgCo2 = Math.round(sensors.reduce((acc, s) => acc + s.co2, 0) / sensors.length);
  const avgTemp = (sensors.reduce((acc, s) => acc + s.temperature, 0) / sensors.length).toFixed(1);
  const avgHumidity = Math.round(sensors.reduce((acc, s) => acc + s.humidity, 0) / sensors.length);
  const healthScore = getHealthScore(avgCo2, parseFloat(avgTemp), avgHumidity);
  const sensorsOnline = sensors.filter(s => s.status === 'online').length;
  const totalSensors = sensors.length;

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setSensors(prev => prev.map(sensor => simulateSensorUpdate(sensor)));
      setTimeout(() => setIsRefreshing(false), 500);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Generate mini chart data for each sensor
  const generateMiniChart = () => {
    return Array.from({ length: 12 }, () => 600 + Math.random() * 400);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
            label="CO₂ Moyen" 
            value={avgCo2} 
            unit="ppm" 
            icon={Activity}
            trend={-5}
            trendLabel="par rapport à hier"
            status={avgCo2 < 800 ? 'success' : avgCo2 < 1000 ? 'warning' : 'danger'}
          />
          <KPICard 
            label="Température" 
            value={avgTemp} 
            unit="°C" 
            icon={Thermometer}
            status="default"
          />
          <KPICard 
            label="Humidité" 
            value={avgHumidity} 
            unit="%" 
            icon={Droplets}
            status="default"
          />
          <KPICard 
            label="Score de Santé" 
            value={healthScore} 
            unit="/100" 
            icon={Heart}
            trend={5}
            trendLabel="amélioration"
            status={healthScore >= 80 ? 'success' : healthScore >= 60 ? 'warning' : 'danger'}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AirQualityOverviewCard
            avgCo2={avgCo2}
            trendData={trendData}
            isRefreshing={isRefreshing}
            sensorsOnline={sensorsOnline}
            totalSensors={totalSensors}
          />

          {/* Right Column - Alerts and Insights */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-xl bg-card border border-border"
            >
              <h3 className="text-base font-semibold text-foreground mb-4">Alertes Récentes</h3>
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert, index) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </motion.div>

            {/* Quick Insights */}
            <QuickInsights
              sensorsOnline={sensorsOnline}
              totalSensors={totalSensors}
              readingsToday={156}
              peakCO2={Math.max(...trendData.map(d => d.co2))}
              bestAirTime="6:00 AM"
            />
          </div>
        </div>

        {/* Active Sensors */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Capteurs Actifs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensors.map((sensor, index) => (
              <SensorCard 
                key={sensor.id} 
                sensor={sensor}
                miniChartData={generateMiniChart()}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
