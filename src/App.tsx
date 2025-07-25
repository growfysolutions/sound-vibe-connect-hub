import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import ProfileSetup from '@/pages/ProfileSetup';
import GigManagement from '@/pages/GigManagement';
import Auth from '@/pages/Auth';
import Messages from '@/pages/Messages';
import Settings from '@/pages/Settings';
import UnifiedSettings from '@/pages/UnifiedSettings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gig-management" element={<GigManagement />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/unified-settings" element={<UnifiedSettings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
