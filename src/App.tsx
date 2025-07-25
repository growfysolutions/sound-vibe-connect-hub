
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import ProfileSetup from '@/pages/ProfileSetup';
import GigManagement from '@/pages/GigManagement';
import Login from '@/pages/Login';
import Messages from '@/pages/Messages';
import Settings from '@/pages/Settings';
import UnifiedSettings from '@/pages/UnifiedSettings';
import CollaborationWorkspace from '@/pages/CollaborationWorkspace';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gig-management" element={<GigManagement />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/unified-settings" element={<UnifiedSettings />} />
          <Route path="/collaboration-workspace" element={<CollaborationWorkspace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
