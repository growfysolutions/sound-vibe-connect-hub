
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";
import PublicProfile from "./pages/PublicProfile";
import Settings from "./pages/Settings";
import UnifiedSettings from "./pages/UnifiedSettings";
import Messages from "./pages/Messages";
import GigManagement from "./pages/GigManagement";
import GigDetails from "./pages/GigDetails";
import GigProposals from "./pages/GigProposals";
import SubmitProposal from "./pages/SubmitProposal";
import MyContracts from "./pages/MyContracts";
import Marketplace from "./pages/Marketplace";
import CollaborationWorkspace from "./pages/CollaborationWorkspace";
import PlatformExpansion from "./pages/PlatformExpansion";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <ProfileProvider>
              <Toaster />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/feed" element={<Dashboard />} />
                  <Route path="/dashboard/discover" element={<Dashboard />} />
                  <Route path="/dashboard/network" element={<Dashboard />} />
                  <Route path="/dashboard/projects" element={<Dashboard />} />
                  <Route path="/dashboard/achievements" element={<Dashboard />} />
                  <Route path="/dashboard/analytics" element={<Dashboard />} />
                  <Route path="/dashboard/calendar" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile-setup" element={<ProfileSetup />} />
                  <Route path="/profile/:id" element={<PublicProfile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/unified-settings" element={<UnifiedSettings />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/gig-management" element={<GigManagement />} />
                  <Route path="/gig/:id" element={<GigDetails />} />
                  <Route path="/gig-proposals" element={<GigProposals />} />
                  <Route path="/submit-proposal/:gigId" element={<SubmitProposal />} />
                  <Route path="/my-contracts" element={<MyContracts />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/collaboration-workspace" element={<CollaborationWorkspace />} />
                  <Route path="/platform-expansion" element={<PlatformExpansion />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ProfileProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
