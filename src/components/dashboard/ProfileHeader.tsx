
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mic, Music } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

export function ProfileHeader({ collapsed }: { collapsed: boolean }) {
  const { profile } = useProfile();

  if (collapsed) {
    return (
      <div className="flex flex-col items-center p-3">
        <div className="relative group">
          <div className="avatar-glow-collapsed">
            <Avatar className="avatar-collapsed">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User avatar'} />
              <AvatarFallback className="avatar-fallback-collapsed">
                {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="status-indicator-collapsed">
              <Music className="w-2 h-2 text-white" />
            </div>
          </div>
        </div>

        <style jsx>{`
          .avatar-glow-collapsed {
            position: relative;
          }

          .avatar-glow-collapsed::before {
            content: '';
            position: absolute;
            inset: -4px;
            background: linear-gradient(45deg, var(--accent-orange, #ff9500), var(--accent-orange-dark, #d97706));
            border-radius: 50%;
            opacity: 0.2;
            transition: opacity 0.3s ease;
          }

          .avatar-glow-collapsed:hover::before {
            opacity: 0.3;
          }

          .avatar-collapsed {
            position: relative;
            width: 48px;
            height: 48px;
            border: 2px solid var(--accent-orange, #ff9500);
            box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.3);
          }

          .avatar-fallback-collapsed {
            background: var(--card-bg, #1e2936);
            color: var(--accent-orange, #ff9500);
            font-weight: bold;
            font-size: 18px;
          }

          .status-indicator-collapsed {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 16px;
            height: 16px;
            background: #10b981;
            border-radius: 50%;
            border: 2px solid var(--secondary-bg, #1a1f2e);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Profile Card */}
      <div className="profile-card-container">
        <div className="profile-card">
          {/* Avatar and Info */}
          <div className="profile-header-content">
            <div className="avatar-container">
              <div className="avatar-glow">
                <Avatar className="profile-avatar">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User avatar'} />
                  <AvatarFallback className="profile-avatar-fallback">
                    {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="status-indicator">
                  <Music className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="profile-info">
              {/* Names */}
              <div className="name-section">
                <h3 className="profile-name">
                  {profile?.full_name || 'Saksham Agarwal'}
                </h3>
                <p className="profile-name-punjabi" style={{ fontFamily: 'serif' }}>
                  ਸਕਸ਼ਮ ਅਗਰਵਾਲ
                </p>
              </div>
              
              {/* Role Badge */}
              <Badge variant="secondary" className="role-badge">
                <Mic className="w-3 h-3 mr-1" />
                {profile?.role || 'Aspiring Artist'}
              </Badge>
            </div>
          </div>
          
          {/* Location */}
          <div className="location-info">
            <MapPin className="w-3 h-3 mr-1" />
            <span>📍 Punjab, India</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-card-container {
          position: relative;
        }

        .profile-card {
          background: var(--card-bg, #1e2936);
          border: 1px solid var(--border-color, #374151);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .profile-card:hover {
          border-color: rgba(255, 149, 0, 0.3);
        }

        .profile-header-content {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .avatar-container {
          position: relative;
        }

        .avatar-glow {
          position: relative;
        }

        .avatar-glow::before {
          content: '';
          position: absolute;
          inset: -8px;
          background: linear-gradient(45deg, var(--accent-orange, #ff9500), var(--accent-orange-dark, #d97706));
          border-radius: 50%;
          opacity: 0.2;
          transition: opacity 0.3s ease;
          filter: blur(4px);
        }

        .avatar-glow:hover::before {
          opacity: 0.3;
        }

        .profile-avatar {
          position: relative;
          width: 64px;
          height: 64px;
          border: 2px solid var(--accent-orange, #ff9500);
          box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.3);
        }

        .profile-avatar-fallback {
          background: var(--card-bg, #1e2936);
          color: var(--accent-orange, #ff9500);
          font-weight: bold;
          font-size: 24px;
        }

        .status-indicator {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 20px;
          height: 20px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid var(--secondary-bg, #1a1f2e);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .name-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .profile-name {
          font-weight: 600;
          font-size: 18px;
          color: var(--text-primary, #ffffff);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-name-punjabi {
          font-size: 14px;
          color: var(--text-secondary, #9ca3af);
          margin: 0;
        }

        .role-badge {
          background: rgba(255, 149, 0, 0.1);
          color: var(--accent-orange, #ff9500);
          border: 1px solid rgba(255, 149, 0, 0.3);
          font-size: 12px;
          align-self: flex-start;
        }

        .role-badge:hover {
          background: rgba(255, 149, 0, 0.15);
        }

        .location-info {
          display: flex;
          align-items: center;
          margin-top: 12px;
          font-size: 14px;
          color: var(--text-secondary, #9ca3af);
        }
      `}</style>
    </div>
  );
}
