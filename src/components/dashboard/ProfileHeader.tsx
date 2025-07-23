
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Trophy,
  TrendingUp,
  Heart,
  Music,
  Zap,
  Shield,
  Globe,
  Award,
  Target
} from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

export function ProfileHeader() {
  const { profile } = useProfile();

  const stats = [
    { 
      label: 'Level', 
      value: profile?.level || 1, 
      icon: TrendingUp,
      color: 'text-orange-500',
      punjabi: 'ਪੱਧਰ'
    },
    { 
      label: 'Connections', 
      value: '127', 
      icon: Users,
      color: 'text-blue-500',
      punjabi: 'ਕੁਨੈਕਸ਼ਨ'
    },
    { 
      label: 'Projects', 
      value: '23', 
      icon: Music,
      color: 'text-green-500',
      punjabi: 'ਪ੍ਰੋਜੈਕਟ'
    },
    { 
      label: 'Rating', 
      value: profile?.rating || '4.8', 
      icon: Star,
      color: 'text-yellow-500',
      punjabi: 'ਰੇਟਿੰਗ'
    }
  ];

  const achievements = [
    { 
      title: 'Cultural Ambassador', 
      icon: Globe, 
      color: 'text-purple-500',
      description: 'Promoting traditional music'
    },
    { 
      title: 'Top Performer', 
      icon: Award, 
      color: 'text-gold-500',
      description: 'Highest rated this month'
    },
    { 
      title: 'Community Builder', 
      icon: Users, 
      color: 'text-blue-500',
      description: '100+ connections made'
    }
  ];

  return (
    <>
      <style>
        {`
          .profile-header {
            background: linear-gradient(135deg, #1a1f2e 0%, #1e2936 100%);
            border: 1px solid #374151;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            position: relative;
            overflow: hidden;
          }
          
          .profile-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #ff9500, #d97706);
          }
          
          .profile-avatar {
            width: 80px;
            height: 80px;
            border: 3px solid #ff9500;
            box-shadow: 0 0 0 4px rgba(255, 149, 0, 0.2);
          }
          
          .profile-name {
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          
          .profile-role {
            color: #ff9500;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
          }
          
          .profile-location {
            color: #9ca3af;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .profile-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-top: 24px;
          }
          
          .stat-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid #374151;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            transition: all 0.2s ease;
          }
          
          .stat-card:hover {
            background: rgba(255, 149, 0, 0.1);
            border-color: #ff9500;
            transform: translateY(-2px);
          }
          
          .stat-value {
            font-size: 20px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 12px;
            color: #9ca3af;
            margin-bottom: 2px;
          }
          
          .stat-punjabi {
            font-size: 10px;
            color: #6b7280;
            font-family: serif;
          }
          
          .achievements-section {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #374151;
          }
          
          .achievements-title {
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .achievements-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
          
          .achievement-badge {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid #374151;
            border-radius: 8px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
          }
          
          .achievement-badge:hover {
            background: rgba(255, 149, 0, 0.1);
            border-color: #ff9500;
          }
          
          .achievement-icon {
            width: 16px;
            height: 16px;
          }
          
          .achievement-content {
            flex: 1;
            min-width: 0;
          }
          
          .achievement-title {
            font-size: 12px;
            font-weight: 500;
            color: #ffffff;
            margin-bottom: 2px;
          }
          
          .achievement-description {
            font-size: 10px;
            color: #9ca3af;
            line-height: 1.2;
          }
          
          .profile-actions {
            display: flex;
            gap: 12px;
            margin-top: 16px;
          }
          
          .action-btn {
            background: #ff9500;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .action-btn:hover {
            background: #d97706;
            transform: translateY(-1px);
          }
          
          .action-btn.secondary {
            background: transparent;
            color: #9ca3af;
            border: 1px solid #374151;
          }
          
          .action-btn.secondary:hover {
            background: rgba(255, 149, 0, 0.1);
            border-color: #ff9500;
            color: #ff9500;
          }
          
          .online-indicator {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 20px;
            height: 20px;
            background: #10b981;
            border: 3px solid #1a1f2e;
            border-radius: 50%;
          }
          
          .verified-badge {
            background: #3b82f6;
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            gap: 2px;
            margin-left: 8px;
          }
        `}
      </style>
      
      <div className="profile-header">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="profile-avatar">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-2xl">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="online-indicator"></div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center">
                <h1 className="profile-name">
                  {profile?.full_name || 'Music Enthusiast'}
                </h1>
                {profile?.is_verified && (
                  <span className="verified-badge">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              
              <div className="profile-role">
                {profile?.role || 'Aspiring Artist'}
              </div>
              
              <div className="profile-location">
                <MapPin className="w-3 h-3" />
                {profile?.location || 'Punjab, India'}
              </div>
              
              <div className="profile-actions">
                <button className="action-btn">
                  <Zap className="w-4 h-4" />
                  Upgrade Profile
                </button>
                <button className="action-btn secondary">
                  <Target className="w-4 h-4" />
                  View Public Profile
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-orange-500 border-orange-500">
              Pro Member
            </Badge>
            <Badge variant="outline" className="text-green-500 border-green-500">
              Active
            </Badge>
          </div>
        </div>
        
        <div className="profile-stats">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card">
                <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-punjabi">{stat.punjabi}</div>
              </div>
            );
          })}
        </div>
        
        <div className="achievements-section">
          <h3 className="achievements-title">
            <Trophy className="w-5 h-5 text-orange-500" />
            Recent Achievements
          </h3>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="achievement-badge">
                  <Icon className={`achievement-icon ${achievement.color}`} />
                  <div className="achievement-content">
                    <div className="achievement-title">{achievement.title}</div>
                    <div className="achievement-description">{achievement.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
