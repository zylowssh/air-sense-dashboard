import { motion } from 'framer-motion';
import { Activity, Radio } from 'lucide-react';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { LiveIndicator } from '@/components/dashboard/LiveIndicator';
import { Co2DonutGauge } from '@/components/dashboard/Co2DonutGauge';
import type { Reading } from '@/lib/sensorData';
import { cn } from '@/lib/utils';

interface AirQualityOverviewCardProps {
  avgCo2: number;
  trendData: Reading[];
  isRefreshing: boolean;
  sensorsOnline: number;
  totalSensors: number;
}

export function AirQualityOverviewCard({
  avgCo2,
  trendData,
  isRefreshing,
  sensorsOnline,
  totalSensors,
}: AirQualityOverviewCardProps) {
  const peak = Math.max(...trendData.map((d) => d.co2));

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative lg:col-span-2 rounded-xl border border-border p-6 overflow-hidden',
        'gradient-card'
      )}
      aria-labelledby="air-quality-overview"
    >
      {/* Ambient highlight */}
      <div
        className={cn(
          'pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl',
          'bg-primary/10'
        )}
      />

      <header className="relative flex items-start justify-between gap-4">
        <div>
          <h2 id="air-quality-overview" className="text-lg font-semibold text-foreground">
            Air Quality Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring across all sensors
          </p>
        </div>

        <LiveIndicator isRefreshing={isRefreshing} />
      </header>

      <div className="relative mt-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Gauge + quick stats */}
        <div className="xl:col-span-4 flex flex-col items-center justify-center">
          <Co2DonutGauge co2={avgCo2} size={210} />

          <div className="mt-5 w-full max-w-sm grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-background/30 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>Peak (range)</span>
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground tabular-nums">
                {peak} ppm
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background/30 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Radio className="h-4 w-4" />
                <span>Sensors online</span>
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground tabular-nums">
                {sensorsOnline}/{totalSensors}
              </div>
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className="xl:col-span-8 rounded-xl border border-border bg-background/20 p-4">
          <TrendChart title={null} data={trendData} height={260} />
        </div>
      </div>
    </motion.section>
  );
}
