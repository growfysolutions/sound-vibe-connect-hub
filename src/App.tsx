
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ABTestProvider } from './hooks/useABTesting';
import Index from "./pages/Index";
import Settings from './pages/Settings';
import ProfileSetup from "./pages/ProfileSetup";
import Login from "./pages/Login";
import DashboardPage from './pages/Dashboard';
import ProfilePage from "./pages/Profile";
import PublicProfilePage from "./pages/PublicProfile";
import Marketplace from "./pages/Marketplace";
import GigDetails from "./pages/GigDetails";
import SubmitProposal from "./pages/SubmitProposal";
import GigProposals from "./pages/GigProposals";
import MyContracts from "./pages/MyContracts";
import Messages from "./pages/Messages";
import CollaborationWorkspace from "./pages/CollaborationWorkspace";
import GigManagement from "./pages/GigManagement";
import NotFound from "./pages/NotFound";
import { SoundVibeCardsShowcase } from "./components/cards/SoundVibeCardsShowcase";
import { CulturalFeedbackWidget } from "./components/feedback/CulturalFeedbackWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AuthProvider>
          <ABTestProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Login />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/public-profile" element={<PublicProfilePage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/gigs/:gigId" element={<GigDetails />} />
              <Route path="/gigs/:gigId/propose" element={<SubmitProposal />} />
              <Route path="/gigs/:gigId/proposals" element={<GigProposals />} />
              <Route path="/gig-management" element={<GigManagement />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/contracts" element={<MyContracts />} />
              <Route path="/collaborate/:projectId" element={<CollaborationWorkspace />} />
              <Route path="/showcase" element={<SoundVibeCardsShowcase />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CulturalFeedbackWidget />
          </ABTestProvider>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
