import { Bell, Moon, Sun, User, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  userName?: string;
}

export function TopBar({ title = "Dashboard", subtitle, userName = "Alex" }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50 backdrop-blur-sm">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {title === "Dashboard" ? `${getGreeting()}, ${userName}` : title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
        {title === "Dashboard" && (
          <p className="text-sm text-muted-foreground mt-0.5">Here's your air quality overview</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
        
        <Button size="sm" className="gap-2 gradient-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4" />
          Add Sensor
        </Button>

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>

          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
