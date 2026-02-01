import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Comparison from "./pages/Comparison";
import Sensors from "./pages/Sensors";
import SensorDetail from "./pages/SensorDetail";
import SensorMap from "./pages/SensorMap";
import Alerts from "./pages/Alerts";
import AlertHistory from "./pages/AlertHistory";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Recommendations from "./pages/Recommendations";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <WebSocketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/sensors" element={<Sensors />} />
              <Route path="/sensors/:sensorId" element={<SensorDetail />} />
              <Route path="/sensor-map" element={<SensorMap />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/alert-history" element={<AlertHistory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WebSocketProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
