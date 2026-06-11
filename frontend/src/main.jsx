import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 2 * 60_000,        // 2 min — avoids hammering the API on every re-render
      gcTime: 10 * 60_000,          // keep cache 10 min before GC
      refetchOnWindowFocus: false,  // don't refetch when user alt-tabs back
    },
  },
});

function ThemedToaster() {
  const { isDark } = useTheme();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: isDark
          ? { background: '#1a1a1a', color: '#fff',    border: '1px solid #2a2a2a' }
          : { background: '#ffffff', color: '#0f2d20', border: '1px solid #e7e4d5' },
        success: { iconTheme: { primary: '#2a7a4a', secondary: isDark ? '#fff' : '#ffffff' } },
      }}
    />
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
        <ThemedToaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
