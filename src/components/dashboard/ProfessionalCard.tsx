
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { CulturalCard } from '@/components/cards/CulturalCard';
import { MapPin, UserPlus, MessageCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Profile } from './UserProfileCard';
import { cn } from '@/lib/utils';

interface ProfessionalCardProps {
  professional: Profile;
  actions?: React.ReactNode;
  handleConnect?: (id: string) => void;
  handleSendMessage?: (id: string) => void;
  isPending?: boolean;
  score?: number;
  scoreBreakdown?: any;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ 
  professional, 
  actions, 
  handleConnect, 
  handleSendMessage, 
  isPending, 
  score 
}) => {
  return (
    <CulturalCard 
      variant="profile"
      className={cn(
        "w-full transition-all duration-300 hover:-translate-y-1",
        "shadow-modern-ocean hover:shadow-ocean-glow",
        "bg-gradient-to-br from-card via-card to-hsl(var(--ocean-blue))/5"
      )}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={cn(
              "absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-card shadow-sm",
              professional.is_online === true ? 'bg-hsl(var(--color-success-500))' : 'bg-muted-foreground/50'
            )}></div>
            <Avatar className="w-14 h-14 border-2 border-hsl(var(--ocean-blue))/30 ring-2 ring-hsl(var(--ocean-blue))/20 shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-hsl(var(--ocean-blue))/20 to-hsl(var(--teal))/20 text-hsl(var(--ocean-blue)) font-semibold">
                {professional.full_name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{professional.full_name}</h3>
            <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
              {professional.role && (
                <Badge variant="secondary" className="text-xs bg-hsl(var(--ocean-blue))/10 text-hsl(var(--ocean-blue)) border-hsl(var(--ocean-blue))/20">
                  {professional.role}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          {score !== undefined && (
            <div className="flex items-center justify-end text-hsl(var(--ocean-blue)) text-sm font-bold mb-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{score}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-3 mb-4">
        {professional.location && (
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-2 text-hsl(var(--ocean-blue))" />
            <span>{professional.location}</span>
          </div>
        )}
        {professional.skills && (
          <div className="flex flex-wrap gap-1">
            {professional.skills.slice(0, 3).map(skill => (
              <Badge key={skill} variant="outline" className="text-xs border-hsl(var(--teal))/30 text-hsl(var(--teal))">
                {skill}
              </Badge>
            ))}
            {professional.skills.length > 3 && (
              <Badge variant="outline" className="text-xs border-hsl(var(--ocean-blue))/30 text-hsl(var(--ocean-blue))">
                +{professional.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-2">
        {actions ? actions : (
          <>
            <CulturalButton 
              variant="secondary" 
              size="sm" 
              onClick={() => handleConnect?.(professional.id)} 
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? (
                'Pending'
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connect
                </>
              )}
            </CulturalButton>
            <CulturalButton 
              size="sm" 
              variant="primary" 
              onClick={() => handleSendMessage?.(professional.id)}
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </CulturalButton>
          </>
        )}
      </div>
    </CulturalCard>
  );
};

export default ProfessionalCard;
