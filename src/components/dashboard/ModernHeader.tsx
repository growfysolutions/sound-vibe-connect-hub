
import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Upload, Radio, Calendar, Bell, Moon, Sun, Menu, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useTheme } from '@/components/theme-provider';
import NotificationBell from './NotificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModernHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleOpenModal: () => void;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ searchQuery, setSearchQuery, handleOpenModal }) => {
  const { profile, loading } = useProfile();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const NavButton = ({ icon: Icon, label, badge, status, onClick }: {
    icon: any;
    label: string;
    badge?: string;
    status?: 'live';
    onClick?: () => void;
  }) => (
    <button 
      className={`nav-button ${badge ? 'has-badge' : ''}`}
      data-badge={badge}
      onClick={onClick}
    >
      <Icon className="w-4 h-4" />
      <span className="nav-label">{label}</span>
      {status === 'live' && <div className="live-indicator" />}
    </button>
  );

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo">
          <h1 className="logo-text">SoundVibe</h1>
          <span className="logo-subtitle">Music Collaboration</span>
        </div>

        {/* Search Section - Desktop */}
        <div className="header-search desktop-only">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search artists, songs, projects..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchExpanded && (
          <div className="mobile-search-overlay">
            <div className="mobile-search-container">
              <button 
                className="search-back-btn"
                onClick={() => setIsSearchExpanded(false)}
              >
                ←
              </button>
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearch}
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation - Desktop */}
        <nav className="header-navigation desktop-only">
          <NavButton 
            icon={ShoppingBag} 
            label="Market" 
            badge="3"
            onClick={() => navigate('/marketplace')}
          />
          <NavButton 
            icon={Upload} 
            label="Share"
            onClick={handleOpenModal}
          />
          <NavButton 
            icon={Radio} 
            label="Live" 
            status="live"
          />
          <NavButton 
            icon={Calendar} 
            label="Events"
          />
        </nav>

        {/* User Actions */}
        <div className="header-actions">
          {/* Mobile Search Button */}
          <button 
            className="action-button mobile-only"
            onClick={() => setIsSearchExpanded(true)}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button 
            className="action-button theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="action-button notification-wrapper">
            <NotificationBell />
          </div>

          {/* Mobile Menu */}
          <button 
            className="action-button mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="user-profile">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.full_name || 'User'} 
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-fallback">
                    {profile?.full_name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                )}
                <div className="user-status-dot" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="user-dropdown" align="end">
              <DropdownMenuLabel>
                <div className="user-info">
                  <p className="user-name">{profile?.full_name ?? user?.email ?? 'User'}</p>
                  <p className="user-level">Level 7 • 75% Complete</p>
                  <div className="user-progress">
                    <div className="progress-bar" style={{ width: '75%' }} />
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)}>
                <User className="w-4 h-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="logout-item">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <NavButton 
            icon={ShoppingBag} 
            label="Marketplace" 
            onClick={() => {
              navigate('/marketplace');
              setIsMobileMenuOpen(false);
            }}
          />
          <NavButton 
            icon={Upload} 
            label="Share Art"
            onClick={() => {
              handleOpenModal();
              setIsMobileMenuOpen(false);
            }}
          />
          <NavButton 
            icon={Radio} 
            label="Go Live"
          />
          <NavButton 
            icon={Calendar} 
            label="Events"
          />
        </div>
      )}
    </header>
  );
};

export default ModernHeader;
