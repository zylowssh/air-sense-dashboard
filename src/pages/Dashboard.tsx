import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Activity, Heart } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { AirQualityGauge } from '@/components/dashboard/AirQualityGauge';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { SensorCard } from '@/components/dashboard/SensorCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { QuickInsights } from '@/components/dashboard/QuickInsights';
import { LiveIndicator } from '@/components/dashboard/LiveIndicator';
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
            label="Average CO₂" 
            value={avgCo2} 
            unit="ppm" 
            icon={Activity}
            trend={-5}
            trendLabel="vs yesterday"
            status={avgCo2 < 800 ? 'success' : avgCo2 < 1000 ? 'warning' : 'danger'}
          />
          <KPICard 
            label="Temperature" 
            value={avgTemp} 
            unit="°C" 
            icon={Thermometer}
            status="default"
          />
          <KPICard 
            label="Humidity" 
            value={avgHumidity} 
            unit="%" 
            icon={Droplets}
            status="default"
          />
          <KPICard 
            label="Health Score" 
            value={healthScore} 
            unit="/100" 
            icon={Heart}
            trend={5}
            trendLabel="improvement"
            status={healthScore >= 80 ? 'success' : healthScore >= 60 ? 'warning' : 'danger'}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Air Quality Overview - Takes 2 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Air Quality Overview</h2>
                <p className="text-sm text-muted-foreground">Real-time monitoring across all sensors</p>
              </div>
              <LiveIndicator isRefreshing={isRefreshing} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <AirQualityGauge co2={avgCo2} size={220} />
              </div>
              <TrendChart data={trendData} height={220} />
            </div>
          </motion.div>

          {/* Right Column - Alerts and Insights */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-xl bg-card border border-border"
            >
              <h3 className="text-base font-semibold text-foreground mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert, index) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </motion.div>

            {/* Quick Insights */}
            <QuickInsights
              sensorsOnline={sensors.filter(s => s.status === 'online').length}
              totalSensors={sensors.length}
              readingsToday={156}
              peakCO2={Math.max(...trendData.map(d => d.co2))}
              bestAirTime="6:00 AM"
            />
          </div>
        </div>

        {/* Active Sensors */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Active Sensors</h2>
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
