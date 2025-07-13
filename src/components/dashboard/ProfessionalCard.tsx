import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, UserPlus, MessageCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Profile } from './UserProfileCard';

interface ProfessionalCardProps {
  professional: Profile;
  actions?: React.ReactNode;
  handleConnect?: (id: string) => void;
  handleSendMessage?: (id: string) => void;
  isPending?: boolean;
  score?: number;
  scoreBreakdown?: any; // Can be refined later
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, actions, handleConnect, handleSendMessage, isPending, score }) => {
  return (
    <Card key={professional.id} className="floating-card group hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className={`absolute top-0 right-0 h-3 w-3 rounded-full ${professional.is_online === true ? 'bg-green-500' : 'bg-gray-400'} border-2 border-background`}></div>
              <Avatar className="w-12 h-12 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {professional.full_name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold">{professional.full_name}</h3>
              <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                {professional.role && (
                  <Badge variant="secondary" className="text-xs">{professional.role}</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {score !== undefined && (
              <div className="flex items-center justify-end text-primary text-sm font-bold mb-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                {score}%
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {professional.location && (
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="w-3 h-3 mr-2" />
              {professional.location}
            </div>
          )}
          {professional.skills && (
            <div className="flex flex-wrap gap-1 mt-2">
              {professional.skills.slice(0, 3).map(skill => (
                <Badge key={skill} variant="outline" className="text-xs font-light">{skill}</Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2">
          {actions ? actions : (
            <>
              <Button variant="outline" size="sm" onClick={() => handleConnect?.(professional.id)} disabled={isPending}>
                  {isPending ? (
                    'Pending'
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect
                    </>
                  )}
              </Button>
              <Button size="sm" className="btn-premium" onClick={() => handleSendMessage?.(professional.id)}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCard;
