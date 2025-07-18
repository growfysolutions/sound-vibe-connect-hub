import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Index from "./pages/Index";
import Settings from './pages/Settings';
import ProfileSetup from "./pages/ProfileSetup";
import Login from "./pages/Login";
import DashboardPage from './pages/Dashboard';
import ProfilePage from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import GigDetails from "./pages/GigDetails";
import SubmitProposal from "./pages/SubmitProposal";
import GigProposals from "./pages/GigProposals";
import MyContracts from "./pages/MyContracts";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/gigs/:gigId" element={<GigDetails />} />
            <Route path="/gigs/:gigId/propose" element={<SubmitProposal />} />
            <Route path="/gigs/:gigId/proposals" element={<GigProposals />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/contracts" element={<MyContracts />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
