import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Plus, Radio, MapPin, Battery, Edit, Trash2, MoreHorizontal, Grid, List, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateMockSensors, Sensor } from '@/lib/sensorData';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Sensors = () => {
  const [sensors] = useState<Sensor[]>(generateMockSensors());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const StatusBadge = ({ status }: { status: Sensor['status'] }) => {
    const styles = {
      online: 'bg-success/10 border-success/30 text-success',
      offline: 'bg-muted border-muted-foreground/30 text-muted-foreground',
      warning: 'bg-warning/10 border-warning/30 text-warning'
    };

    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border",
        styles[status]
      )}>
        <span className={cn("w-1.5 h-1.5 rounded-full", {
          'bg-success': status === 'online',
          'bg-muted-foreground': status === 'offline',
          'bg-warning': status === 'warning'
        })} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AppLayout title="Sensors" subtitle="Manage your monitoring devices">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              All Sensors
            </Button>
            <Button variant="outline" size="sm">Room</Button>
            <Button variant="outline" size="sm">Status</Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted/50'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button size="sm" className="gap-2 gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4" />
              Add Sensor
            </Button>
          </div>
        </div>

        {/* Sensors Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Device Stats</TableHead>
                <TableHead className="text-muted-foreground">Room</TableHead>
                <TableHead className="text-muted-foreground">Location</TableHead>
                <TableHead className="text-muted-foreground text-right">CO₂</TableHead>
                <TableHead className="text-muted-foreground text-right">Temperature</TableHead>
                <TableHead className="text-muted-foreground text-right">Humidity</TableHead>
                <TableHead className="text-muted-foreground text-center">Sensor</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensors.map((sensor, index) => (
                <TableRow key={sensor.id} className="border-border hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        sensor.status === 'online' ? 'bg-primary/10' : 
                        sensor.status === 'warning' ? 'bg-warning/10' : 'bg-muted'
                      )}>
                        <Radio className={cn(
                          "w-4 h-4",
                          sensor.status === 'online' ? 'text-primary' : 
                          sensor.status === 'warning' ? 'text-warning' : 'text-muted-foreground'
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{sensor.name}</p>
                        <p className="text-xs text-muted-foreground">{sensor.location}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={sensor.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    Building A, Floor 1<br />
                    <span className="text-xs">Supermini</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-semibold",
                      sensor.co2 < 800 ? 'text-primary' : 
                      sensor.co2 < 1000 ? 'text-warning' : 'text-destructive'
                    )}>
                      {sensor.co2}
                    </span>
                    <span className="text-muted-foreground ml-1">ppm</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-foreground">{sensor.temperature}</span>
                    <span className="text-muted-foreground">°C</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-foreground">{sensor.humidity}</span>
                    <span className="text-muted-foreground">%</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Radio className="w-3.5 h-3.5" />
                      Sensors
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Calibrate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Sensors', value: sensors.length, icon: Radio },
            { label: 'Online', value: sensors.filter(s => s.status === 'online').length, color: 'text-success' },
            { label: 'Warnings', value: sensors.filter(s => s.status === 'warning').length, color: 'text-warning' },
            { label: 'Offline', value: sensors.filter(s => s.status === 'offline').length, color: 'text-muted-foreground' }
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
      </div>
    </AppLayout>
  );
};

export default Sensors;
