import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Plus, Eye, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateMockSensors } from '@/lib/sensorData';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Reports = () => {
  const sensors = generateMockSensors();

  const reports = [
    { id: 1, name: 'Weekly Air Quality Summary', date: 'Jan 22, 2026', type: 'Automated', status: 'Ready' },
    { id: 2, name: 'Monthly Compliance Report', date: 'Jan 1, 2026', type: 'Automated', status: 'Ready' },
    { id: 3, name: 'Q4 2025 Analysis', date: 'Dec 31, 2025', type: 'Custom', status: 'Ready' },
    { id: 4, name: 'Server Room Audit', date: 'Jan 15, 2026', type: 'Custom', status: 'Processing' }
  ];

  return (
    <AppLayout title="Rapports" subtitle="Générer et exporter des rapports de qualité de l'air">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              Ce Mois
            </Button>
            <Button variant="outline" size="sm">Tous les Rapports</Button>
          </div>

          <Button size="sm" className="gap-2 gradient-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
            Nouveau Rapport
          </Button>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Résumé Quotidien', description: 'Aperçu quotidien automatisé de la qualité de l\'air', icon: FileText, color: 'text-primary' },
            { title: 'Analyse Hebdomadaire', description: 'Tendances et modèles sur la semaine', icon: BarChart3, color: 'text-warning' },
            { title: 'Rapport de Conformité', description: 'Documentation de conformité réglementaire', icon: FileText, color: 'text-success' }
          ].map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className={cn("p-2 rounded-lg bg-muted w-fit mb-3", `group-hover:${type.color.replace('text-', 'bg-')}/10`)}>
                <type.icon className={cn("w-5 h-5", type.color)} />
              </div>
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{type.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Rapports Récents</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Voir la Liste des Rapports
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Nom du Rapport</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Statut</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="border-border hover:bg-muted/30">
                  <TableCell className="font-medium text-foreground">{report.name}</TableCell>
                  <TableCell className="text-muted-foreground">{report.date}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      report.type === 'Automated' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {report.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      report.status === 'Ready' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-warning/10 text-warning'
                    )}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="gap-1.5" disabled={report.status !== 'Ready'}>
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        {/* Sensor Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Export Rapide par Capteur</h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Capteur</TableHead>
                <TableHead className="text-muted-foreground">Statut</TableHead>
                <TableHead className="text-muted-foreground text-right">CO₂</TableHead>
                <TableHead className="text-muted-foreground text-right">Température</TableHead>
                <TableHead className="text-muted-foreground text-right">Humidité</TableHead>
                <TableHead className="text-muted-foreground text-right">Export</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensors.map((sensor) => (
                <TableRow key={sensor.id} className="border-border hover:bg-muted/30">
                  <TableCell className="font-medium text-foreground">{sensor.name}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      sensor.status === 'online' 
                        ? 'bg-success/10 border-success/30 text-success' 
                        : 'bg-warning/10 border-warning/30 text-warning'
                    )}>
                      {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-foreground">{sensor.co2}</span>
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
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="gap-1.5 gradient-primary text-primary-foreground border-0">
                      Export
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Reports;
