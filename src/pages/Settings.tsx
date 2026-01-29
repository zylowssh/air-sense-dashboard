import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Building, Bell, Shield, Users, Plug, Palette, Moon, Sun, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <AppLayout title="Settings" subtitle="Manage your organization and preferences">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50">
            <TabsTrigger value="general" className="gap-2">
              <Building className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Bell className="w-4 h-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Plug className="w-4 h-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Organization</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input id="orgName" defaultValue="Acme Corporation" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input id="timezone" defaultValue="Europe/London" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="123 Business Street, London" />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Data Retention</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Keep historical data</p>
                      <p className="text-sm text-muted-foreground">How long to store sensor readings</p>
                    </div>
                    <select className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground">
                      <option>1 year</option>
                      <option>2 years</option>
                      <option>Forever</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Auto-export reports</p>
                      <p className="text-sm text-muted-foreground">Automatically generate weekly reports</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Alert Settings */}
          <TabsContent value="alerts">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Threshold Settings</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Warning Level (ppm)</Label>
                      <Input type="number" defaultValue="800" />
                    </div>
                    <div className="space-y-2">
                      <Label>Critical Level (ppm)</Label>
                      <Input type="number" defaultValue="1200" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Notification Channels</h3>
                
                <div className="space-y-4">
                  {[
                    { name: 'Email Notifications', description: 'Get alerts sent to your email' },
                    { name: 'In-App Notifications', description: 'Show alerts in the dashboard' },
                    { name: 'Slack Integration', description: 'Post alerts to a Slack channel' },
                    { name: 'Webhook', description: 'Send alerts to a custom endpoint' }
                  ].map((channel, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-foreground">{channel.name}</p>
                        <p className="text-sm text-muted-foreground">{channel.description}</p>
                      </div>
                      <Switch defaultChecked={index < 2} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Theme</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Moon className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Dark Mode</span>
                    </div>
                    <div className="h-20 rounded-lg bg-[#0B1220] border border-[#1E2A4A]">
                      <div className="p-2 space-y-1">
                        <div className="h-2 w-12 bg-[#2FE6D6] rounded" />
                        <div className="h-1.5 w-20 bg-[#9FB0D0] rounded opacity-50" />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => theme !== 'light' && toggleTheme()}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      theme === 'light' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Sun className="w-5 h-5 text-warning" />
                      <span className="font-medium text-foreground">Light Mode</span>
                    </div>
                    <div className="h-20 rounded-lg bg-white border border-gray-200">
                      <div className="p-2 space-y-1">
                        <div className="h-2 w-12 bg-[#0D9488] rounded" />
                        <div className="h-1.5 w-20 bg-gray-400 rounded opacity-50" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Display Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Compact Mode</p>
                      <p className="text-sm text-muted-foreground">Reduce spacing for more data density</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Show Animations</p>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Users Settings */}
          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
                <Button size="sm" className="gradient-primary text-primary-foreground">
                  Invite User
                </Button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Alex Johnson', email: 'alex@acme.com', role: 'Admin' },
                  { name: 'Sarah Miller', email: 'sarah@acme.com', role: 'Editor' },
                  { name: 'Mike Chen', email: 'mike@acme.com', role: 'Viewer' }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      user.role === 'Admin' ? 'bg-primary/10 text-primary' :
                      user.role === 'Editor' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Integrations Settings */}
          <TabsContent value="integrations">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {[
                { name: 'Slack', description: 'Send alerts to Slack channels', connected: true },
                { name: 'Google Home', description: 'Voice commands and smart home integration', connected: false },
                { name: 'Webhooks', description: 'Custom HTTP endpoints for alerts', connected: true },
                { name: 'IFTTT', description: 'Connect with thousands of apps', connected: false }
              ].map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-5 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Plug className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Button variant={integration.connected ? 'outline' : 'default'} size="sm">
                    {integration.connected ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
