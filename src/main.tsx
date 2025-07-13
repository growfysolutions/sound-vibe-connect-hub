import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ProfileProvider } from '@/contexts/ProfileContext';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <ProfileProvider>
      <App />
    </ProfileProvider>
    <Toaster />
  </ThemeProvider>
);
