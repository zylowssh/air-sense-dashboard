import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Radio, 
  Thermometer, 
  Droplets, 
  Activity,
  Settings2,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  Wifi,
  Battery,
  MapPin
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import { format, subHours } from 'date-fns';
import { cn } from '@/lib/utils';

// Generate mock historical data
const generateHistoricalData = (hours: number) => {
  const data = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const timestamp = subHours(now, i);
    const baseValue = 600 + Math.sin(i * 0.5) * 200;
    data.push({
      timestamp,
      time: format(timestamp, 'HH:mm'),
      co2: Math.round(baseValue + Math.random() * 100),
      temperature: 21 + Math.sin(i * 0.3) * 2 + Math.random(),
      humidity: 45 + Math.cos(i * 0.2) * 10 + Math.random() * 5,
    });
  }
  return data;
};

// Mock sensor details
const mockSensor = {
  id: 'sensor-001',
  name: 'Meeting Room A',
  location: 'Floor 2, Building A',
  status: 'online',
  co2: 847,
  temperature: 22.4,
  humidity: 48,
  battery: 85,
  signalStrength: -42,
  firmware: 'v2.4.1',
  lastCalibration: '2025-12-15',
  installDate: '2024-06-20',
  model: 'Aerium Pro X1',
  serialNumber: 'APX1-2024-00847',
};

const calibrationSettings = {
  co2Offset: 0,
  temperatureOffset: 0,
  humidityOffset: 0,
  samplingInterval: 30,
  transmitInterval: 60,
};

const SensorDetail = () => {
  const { sensorId } = useParams();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [calibration, setCalibration] = useState(calibrationSettings);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const historicalData = useMemo(() => {
    const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    return generateHistoricalData(hours);
  }, [timeRange]);

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => setIsCalibrating(false), 2000);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="text-sm text-muted-foreground">{payload[0]?.payload?.time}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              {entry.name === 'co2' ? ' ppm' : entry.name === 'temperature' ? '°C' : '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/sensors')}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{mockSensor.name}</h1>
              <Badge 
                variant="outline" 
                className={cn(
                  mockSensor.status === 'online' 
                    ? 'bg-success/20 text-success border-success/30' 
                    : 'bg-destructive/20 text-destructive border-destructive/30'
                )}
              >
                {mockSensor.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span>{mockSensor.location}</span>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>

        {/* Live Readings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'CO₂', value: mockSensor.co2, unit: 'ppm', icon: Activity, color: 'text-primary' },
            { label: 'Temperature', value: mockSensor.temperature.toFixed(1), unit: '°C', icon: Thermometer, color: 'text-warning' },
            { label: 'Humidity', value: mockSensor.humidity, unit: '%', icon: Droplets, color: 'text-blue-400' },
            { label: 'Battery', value: mockSensor.battery, unit: '%', icon: Battery, color: 'text-success' },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <metric.icon className={cn("w-5 h-5", metric.color)} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold text-foreground">
                        {metric.value}
                        <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="history" className="gap-2">
              <Activity className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="calibration" className="gap-2">
              <Settings2 className="w-4 h-4" />
              Calibration
            </TabsTrigger>
            <TabsTrigger value="firmware" className="gap-2">
              <Cpu className="w-4 h-4" />
              Firmware
            </TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <CardTitle className="text-lg">Historical Data</CardTitle>
                  <div className="flex gap-2">
                    {(['24h', '7d', '30d'] as const).map((range) => (
                      <Button
                        key={range}
                        variant={timeRange === range ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTimeRange(range)}
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={historicalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        yAxisId="co2"
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        domain={[400, 'auto']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        yAxisId="co2"
                        type="monotone"
                        dataKey="co2"
                        stroke="none"
                        fill="url(#co2Gradient)"
                      />
                      <Line
                        yAxisId="co2"
                        type="monotone"
                        dataKey="co2"
                        name="co2"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calibration Tab */}
          <TabsContent value="calibration">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Sensor Offsets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>CO₂ Offset</Label>
                      <span className="text-sm text-muted-foreground">{calibration.co2Offset} ppm</span>
                    </div>
                    <Slider
                      value={[calibration.co2Offset]}
                      onValueChange={([value]) => setCalibration(prev => ({ ...prev, co2Offset: value }))}
                      min={-50}
                      max={50}
                      step={1}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Temperature Offset</Label>
                      <span className="text-sm text-muted-foreground">{calibration.temperatureOffset}°C</span>
                    </div>
                    <Slider
                      value={[calibration.temperatureOffset]}
                      onValueChange={([value]) => setCalibration(prev => ({ ...prev, temperatureOffset: value }))}
                      min={-5}
                      max={5}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Humidity Offset</Label>
                      <span className="text-sm text-muted-foreground">{calibration.humidityOffset}%</span>
                    </div>
                    <Slider
                      value={[calibration.humidityOffset]}
                      onValueChange={([value]) => setCalibration(prev => ({ ...prev, humidityOffset: value }))}
                      min={-10}
                      max={10}
                      step={1}
                    />
                  </div>
                  <Button onClick={handleCalibrate} disabled={isCalibrating} className="w-full gap-2">
                    {isCalibrating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Calibrating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Apply Calibration
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Sampling Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="sampling">Sampling Interval (seconds)</Label>
                    <Input
                      id="sampling"
                      type="number"
                      value={calibration.samplingInterval}
                      onChange={(e) => setCalibration(prev => ({ ...prev, samplingInterval: parseInt(e.target.value) }))}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmit">Transmit Interval (seconds)</Label>
                    <Input
                      id="transmit"
                      type="number"
                      value={calibration.transmitInterval}
                      onChange={(e) => setCalibration(prev => ({ ...prev, transmitInterval: parseInt(e.target.value) }))}
                      className="bg-background"
                    />
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Last Calibration</span>
                    </div>
                    <p className="font-medium text-foreground">{mockSensor.lastCalibration}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Firmware Tab */}
          <TabsContent value="firmware">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Device Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { label: 'Model', value: mockSensor.model, icon: Cpu },
                      { label: 'Serial Number', value: mockSensor.serialNumber, icon: Radio },
                      { label: 'Firmware Version', value: mockSensor.firmware, icon: Settings2 },
                      { label: 'Install Date', value: mockSensor.installDate, icon: Clock },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="p-2 rounded-lg bg-background">
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="font-medium text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">Signal Strength</span>
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-success" />
                          <span className="font-medium text-foreground">{mockSensor.signalStrength} dBm</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full bg-success rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(0, (mockSensor.signalStrength + 100) / 60 * 100))}%` }}
                        />
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="font-medium text-primary">Firmware Up to Date</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your sensor is running the latest firmware version.
                      </p>
                    </div>
                    <Button variant="outline" className="w-full gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Check for Updates
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SensorDetail;
