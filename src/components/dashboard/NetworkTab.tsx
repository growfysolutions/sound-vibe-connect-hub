import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, MessageCircle, Search } from 'lucide-react';
import ProfessionalCard from './ProfessionalCard';
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
            {incomingRequests.map((request) => (
              <ProfessionalCard
                key={request.id}
                professional={request.profiles}
                actions={(
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="w-full" onClick={() => handleViewProfile(request.requester_id)}>
                      View Profile
                    </Button>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 flex-1" onClick={() => handleRequestAction(request.id, 'accepted')}>
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleRequestAction(request.id, 'declined')}>
                        Decline
                      </Button>
                    </div>
                  </div>
                )}
              />
            ))}
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
            <ProfessionalCard
              key={connection.id}
              professional={connection}
              actions={
                <>
                  <Button size="sm" variant="outline" className="hover-scale flex-1" onClick={() => handleViewProfile(connection.id)}>
                    View Profile
                  </Button>
                  <Button size="sm" className="btn-premium" onClick={() => handleSendMessage(connection.id)}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </>
              }
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
