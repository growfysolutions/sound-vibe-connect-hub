
import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Upload, Radio, Calendar, Moon, Sun, Menu, User } from 'lucide-react';
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
  const { profile } = useProfile();
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
      className={`nav-button header-element ${badge ? 'has-badge' : ''}`}
      data-badge={badge}
      onClick={onClick}
      aria-label={badge ? `${label} with ${badge} new items` : label}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      <span className="nav-label">{label}</span>
      {badge && <span className="sr-only">{badge} new items</span>}
      {status === 'live' && (
        <>
          <div className="live-indicator" />
          <span className="sr-only">Live</span>
        </>
      )}
    </button>
  );

  return (
    <header className="modern-header w-full h-full" role="banner">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo header-element" tabIndex={0} role="button" onClick={() => navigate('/dashboard')}>
          <h1 className="logo-text">SoundVibe</h1>
          <span className="logo-subtitle">Music Collaboration</span>
        </div>

        {/* Search Section - Desktop */}
        <div className="header-search desktop-only">
          <div className="search-container">
            <Search className="search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search artists, songs, projects..."
              className="search-input header-element"
              value={searchQuery}
              onChange={handleSearch}
              aria-label="Search artists, songs, and projects"
            />
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchExpanded && (
          <div className="mobile-search-overlay" role="dialog" aria-label="Search">
            <div className="mobile-search-container">
              <button 
                className="search-back-btn header-element"
                onClick={() => setIsSearchExpanded(false)}
                aria-label="Close search"
              >
                ←
              </button>
              <div className="search-container">
                <Search className="search-icon" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input header-element"
                  value={searchQuery}
                  onChange={handleSearch}
                  autoFocus
                  aria-label="Search"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation - Desktop */}
        <nav className="header-navigation desktop-only" aria-label="Main navigation">
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
            className="action-button mobile-only header-element"
            onClick={() => setIsSearchExpanded(true)}
            aria-label="Open search"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Theme Toggle */}
          <button 
            className="action-button theme-toggle header-element"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? 
              <Sun className="w-5 h-5 theme-icon" aria-hidden="true" /> : 
              <Moon className="w-5 h-5 theme-icon" aria-hidden="true" />
            }
          </button>

          {/* Notifications */}
          <div className="action-button notification-wrapper">
            <NotificationBell />
          </div>

          {/* Mobile Menu */}
          <button 
            className="action-button mobile-only header-element"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="user-profile header-element" aria-label="User menu">
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
                <div className="user-status-dot" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.full_name ?? user?.email ?? 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Level 7 • 75% Complete
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)}>
                <User className="w-4 h-4 mr-2" aria-hidden="true" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border-t border-border shadow-lg z-50">
          <nav className="p-4 space-y-2" aria-label="Mobile navigation">
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
          </nav>
        </div>
      )}
    </header>
  );
};

export default ModernHeader;
