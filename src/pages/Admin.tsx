import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Activity, 
  Database, 
  Server, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  MoreHorizontal,
  UserPlus,
  Search,
  Filter
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Mock data
const mockUsers = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@aerium.io', role: 'admin', status: 'active', lastActive: '2 mins ago' },
  { id: '2', name: 'Marcus Johnson', email: 'marcus@company.com', role: 'manager', status: 'active', lastActive: '15 mins ago' },
  { id: '3', name: 'Emily Davis', email: 'emily@company.com', role: 'viewer', status: 'active', lastActive: '1 hour ago' },
  { id: '4', name: 'Alex Thompson', email: 'alex@company.com', role: 'manager', status: 'inactive', lastActive: '3 days ago' },
  { id: '5', name: 'Jordan Lee', email: 'jordan@company.com', role: 'viewer', status: 'active', lastActive: '30 mins ago' },
];

const mockAuditLogs = [
  { id: '1', user: 'Sarah Chen', action: 'Updated sensor threshold', target: 'Meeting Room A', timestamp: '2 mins ago', type: 'settings' },
  { id: '2', user: 'Marcus Johnson', action: 'Acknowledged alert', target: 'High CO₂ Warning', timestamp: '15 mins ago', type: 'alert' },
  { id: '3', user: 'System', action: 'Sensor offline detected', target: 'Lobby Sensor', timestamp: '1 hour ago', type: 'system' },
  { id: '4', user: 'Emily Davis', action: 'Exported report', target: 'Weekly Summary', timestamp: '2 hours ago', type: 'report' },
  { id: '5', user: 'Sarah Chen', action: 'Added new user', target: 'Jordan Lee', timestamp: '3 hours ago', type: 'user' },
  { id: '6', user: 'System', action: 'Database backup completed', target: 'Production DB', timestamp: '6 hours ago', type: 'system' },
];

const systemHealthMetrics = [
  { label: 'API Uptime', value: '99.9%', status: 'healthy', icon: Server },
  { label: 'Database', value: '45ms', status: 'healthy', icon: Database },
  { label: 'Active Connections', value: '127', status: 'healthy', icon: Activity },
  { label: 'Last Backup', value: '6h ago', status: 'warning', icon: Clock },
];

const getRoleBadge = (role: string) => {
  const styles = {
    admin: 'bg-primary/20 text-primary border-primary/30',
    manager: 'bg-warning/20 text-warning border-warning/30',
    viewer: 'bg-muted text-muted-foreground border-border',
  };
  return styles[role as keyof typeof styles] || styles.viewer;
};

const getStatusBadge = (status: string) => {
  if (status === 'active') {
    return 'bg-success/20 text-success border-success/30';
  }
  return 'bg-muted text-muted-foreground border-border';
};

const getActionIcon = (type: string) => {
  switch (type) {
    case 'settings': return <Shield className="w-4 h-4 text-primary" />;
    case 'alert': return <AlertTriangle className="w-4 h-4 text-warning" />;
    case 'system': return <Server className="w-4 h-4 text-muted-foreground" />;
    case 'report': return <Activity className="w-4 h-4 text-success" />;
    case 'user': return <Users className="w-4 h-4 text-primary" />;
    default: return <Activity className="w-4 h-4 text-muted-foreground" />;
  }
};

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage users, monitor system health, and view audit logs</p>
          </div>
        </div>

        {/* System Health Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemHealthMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        metric.status === 'healthy' ? 'bg-success/10' : 'bg-warning/10'
                      )}>
                        <metric.icon className={cn(
                          "w-5 h-5",
                          metric.status === 'healthy' ? 'text-success' : 'text-warning'
                        )} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                      </div>
                    </div>
                    {metric.status === 'healthy' ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-warning" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <Clock className="w-4 h-4" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <CardTitle className="text-lg">User Management</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-9 w-full sm:w-64 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add User</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("capitalize", getRoleBadge(user.role))}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("capitalize", getStatusBadge(user.status))}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuItem>Change Role</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <CardTitle className="text-lg">Audit Logs</CardTitle>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAuditLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-background">
                        {getActionIcon(log.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{log.user}</span>
                          <span className="text-muted-foreground">{log.action}</span>
                          <span className="font-medium text-primary">{log.target}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{log.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Admin;
