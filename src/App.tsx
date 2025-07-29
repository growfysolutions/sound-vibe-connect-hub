
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";
import PublicProfile from "./pages/PublicProfile";
import Settings from "./pages/Settings";
import UnifiedSettings from "./pages/UnifiedSettings";
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
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/feed" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/discover" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/network" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/projects" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/achievements" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/analytics" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/calendar" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/messages" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirect old messages route to dashboard */}
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile-setup" element={
                    <ProtectedRoute>
                      <ProfileSetup />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/unified-settings" element={
                    <ProtectedRoute>
                      <UnifiedSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/gig-management" element={
                    <ProtectedRoute>
                      <GigManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/gig-proposals" element={
                    <ProtectedRoute>
                      <GigProposals />
                    </ProtectedRoute>
                  } />
                  <Route path="/submit-proposal/:gigId" element={
                    <ProtectedRoute>
                      <SubmitProposal />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-contracts" element={
                    <ProtectedRoute>
                      <MyContracts />
                    </ProtectedRoute>
                  } />
                  <Route path="/marketplace" element={
                    <ProtectedRoute>
                      <Marketplace />
                    </ProtectedRoute>
                  } />
                  <Route path="/collaboration-workspace/:projectId" element={
                    <ProtectedRoute>
                      <CollaborationWorkspace />
                    </ProtectedRoute>
                  } />
                  <Route path="/platform-expansion" element={
                    <ProtectedRoute>
                      <PlatformExpansion />
                    </ProtectedRoute>
                  } />
                  
                  {/* Public Routes */}
                  <Route path="/profile/:id" element={<PublicProfile />} />
                  <Route path="/gig/:id" element={<GigDetails />} />
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
