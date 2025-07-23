import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search } from 'lucide-react';
import { ArtistProfileCard } from '@/components/cards/ArtistProfileCard';
import { Profile } from '@/types';
import { Connection } from '@/types';

interface NetworkTabProps {
  connections: Profile[];
  incomingRequests: Connection[];
  handleRequestAction: (connectionId: number, newStatus: 'accepted' | 'declined') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleFindConnections: () => void;
  handleViewProfile: (id: string) => void;
  handleSendMessage: (id: string) => void;
}

const NetworkTab: React.FC<NetworkTabProps> = ({
  connections,
  searchQuery,
  setSearchQuery,
  handleFindConnections,
  handleViewProfile,
  handleSendMessage,
  incomingRequests,
  handleRequestAction,
}) => {
  // Get IDs of users who have sent a request to the current user
  const requesterIds = new Set(incomingRequests.map(req => req.requester_id));

  // Filter out connections that are already represented in incoming requests
  const uniqueConnections = connections.filter(conn => !requesterIds.has(conn.id));

  // Apply search filter to the unique connections
  const filteredConnections = uniqueConnections.filter(
    (connection) =>
      connection.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="space-y-6">
      {incomingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Incoming Requests ({incomingRequests.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incomingRequests.map((request) => {
              const profile = (request as any).profiles || { full_name: 'Unknown User', id: request.requester_id };
              return (
                <ArtistProfileCard
                  key={request.id}
                  artist={{
                    id: profile.id,
                    name: profile.full_name || profile.username || 'Unknown',
                    avatar: profile.avatar_url || '',
                    role: profile.role || 'Musician',
                    location: profile.location || '',
                     skills: profile.genres ? 
                       (Array.isArray(profile.genres) ? 
                         profile.genres : 
                         (profile.genres as string).split(',').map((g: string) => g.trim())
                       ) : [],
                    rating: 0,
                    reviewCount: 5,
                    experience: '1+ years',
                    recentWork: 'Recent collaboration',
                    isVerified: false,
                    collaborations: 3
                  }}
                  onConnect={() => handleRequestAction(request.id, 'accepted')}
                  onViewProfile={() => handleViewProfile(request.requester_id)}
                  onSave={() => handleRequestAction(request.id, 'declined')}
                  onShare={(id) => console.log('Shared artist:', id)}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">My Network ({filteredConnections.length})</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search connections..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="btn-premium" onClick={handleFindConnections}>
            <Users className="w-4 h-4 mr-2" />
            Find
          </Button>
        </div>
      </div>

      {filteredConnections.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConnections.map((connection) => (
            <ArtistProfileCard
              key={connection.id}
              artist={{
                id: connection.id,
                name: connection.full_name || connection.username || 'Unknown',
                avatar: connection.avatar_url || '',
                role: connection.role || 'Musician',
                location: connection.location || '',
                 skills: connection.genres ? 
                   (Array.isArray(connection.genres) ? 
                     connection.genres : 
                     (connection.genres as string).split(',').map((g: string) => g.trim())
                   ) : [],
                rating: 0,
                reviewCount: 8,
                experience: '3+ years',
                recentWork: 'Recent project',
                isVerified: true,
                collaborations: 7
              }}
              onConnect={() => handleSendMessage(connection.id)}
              onViewProfile={() => handleViewProfile(connection.id)}
              onSave={(id) => console.log('Saved artist:', id)}
              onShare={(id) => console.log('Shared artist:', id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground">No connections found.</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? "Try a different search." : "Start by finding new connections!"}
          </p>
          <Button onClick={handleFindConnections}>
            <Users className="w-4 h-4 mr-2" />
            Find Connections
          </Button>
        </div>
      )}
    </div>
  );
};

export default NetworkTab;
