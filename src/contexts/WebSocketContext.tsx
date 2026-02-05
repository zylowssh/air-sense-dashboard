import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSettings } from '@/contexts/SettingsContext';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { lowPowerMode } = useSettings();

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

    const newSocket = io(SOCKET_URL, {
      transports: lowPowerMode ? ['polling'] : ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: lowPowerMode ? 3000 : 500,
      reconnectionDelayMax: lowPowerMode ? 10000 : 3000,
      reconnectionAttempts: lowPowerMode ? 3 : 10,
      autoConnect: true,
      forceNew: false,
      multiplex: true,
    });

    newSocket.on('connect', () => {
      console.log('✓ Global WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      console.warn('WebSocket connection error:', error?.message || error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('✗ Global WebSocket disconnected -', reason);
      setIsConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [lowPowerMode]);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};
