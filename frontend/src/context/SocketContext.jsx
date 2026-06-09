import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

function createSocket(token) {
  return io(import.meta.env.VITE_SOCKET_URL || '/', {
    auth: { token },
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });
}

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      return;
    }

    const token = localStorage.getItem('accessToken');
    const s = createSocket(token);

    s.on('connect', () => { socketRef.current = s; setSocket(s); });
    s.on('connect_error', (err) => console.warn('Socket error:', err.message));

    // Reconnect with fresh token when the HTTP interceptor silently refreshes it
    const handleTokenRefresh = (e) => {
      const newToken = e.detail?.accessToken;
      if (!newToken) return;
      socketRef.current?.disconnect();
      const fresh = createSocket(newToken);
      fresh.on('connect', () => { socketRef.current = fresh; setSocket(fresh); });
      fresh.on('connect_error', (err) => console.warn('Socket error:', err.message));
    };

    window.addEventListener('token:refreshed', handleTokenRefresh);

    return () => {
      window.removeEventListener('token:refreshed', handleTokenRefresh);
      s.disconnect();
    };
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
