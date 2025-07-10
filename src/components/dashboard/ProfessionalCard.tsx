import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Mic, Music, Video, Headphones, UserPlus, MessageCircle } from 'lucide-react';
import { Profile } from './UserProfileCard';



interface ProfessionalCardProps {
  professional: Profile;
  actions?: React.ReactNode;
  handleConnect?: (id: string) => void;
  handleSendMessage?: (id: string) => void;
  isPending?: boolean;
}

const getRoleIcon = (role: string) => {
  switch (role.toLowerCase()) {
    case 'singer': return <Mic className="w-4 h-4" />;
    case 'music director': return <Music className="w-4 h-4" />;
    case 'video editor': return <Video className="w-4 h-4" />;
    case 'sound engineer': return <Headphones className="w-4 h-4" />;
    default: return <Music className="w-4 h-4" />;
  }
};

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, actions, handleConnect, handleSendMessage, isPending }) => {
  return (
    <Card key={professional.id} className="floating-card group hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {professional.full_name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {professional.is_online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{professional.full_name}</h3>
                {professional.is_verified && (
                  <Star className="w-4 h-4 text-primary fill-current" />
                )}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {getRoleIcon(professional.role)}
                <span className="text-muted-foreground text-sm">{professional.role}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-primary text-sm mb-1">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {professional.rating}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-3 h-3 mr-2" />
            {professional.location}
          </div>
          <p className="text-sm">{professional.specialization}</p>
          <p className="text-muted-foreground text-xs">{professional.experience}</p>
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
