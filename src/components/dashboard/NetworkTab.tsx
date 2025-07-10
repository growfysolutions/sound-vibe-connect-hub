import { Button } from '@/components/ui/button';
import { Users, MessageCircle } from 'lucide-react';
import ProfessionalCard from './ProfessionalCard';
import { Profile } from './UserProfileCard';

interface NetworkTabProps {
  professionals: Profile[];
  handleFindConnections: () => void;
  handleViewProfile: (id: string) => void;
  handleSendMessage: (id: string) => void;
}

const NetworkTab: React.FC<NetworkTabProps> = ({ professionals, handleFindConnections, handleViewProfile, handleSendMessage }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Network</h2>
        <Button className="btn-premium" onClick={handleFindConnections}>
          <Users className="w-4 h-4 mr-2" />
          Find Connections
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((professional) => (
          <ProfessionalCard
            key={professional.id}
            professional={professional}
            actions={
              <>
                <Button size="sm" variant="outline" className="hover-scale flex-1" onClick={() => handleViewProfile(professional.id)}>
                  View Profile
                </Button>
                <Button size="sm" className="btn-premium" onClick={() => handleSendMessage(professional.id)}>
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default NetworkTab;
