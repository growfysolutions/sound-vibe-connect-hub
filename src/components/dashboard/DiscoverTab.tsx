import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProfessionalCard from './ProfessionalCard';
import { Profile } from './UserProfileCard';
import FilterDrawer, { FilterValues } from './FilterDrawer';

interface DiscoverTabProps {
  professionals: Profile[];
  pendingConnections: string[];
  handleConnect: (id: string) => void;
  handleSendMessage: (id: string) => void;
  handleSearch: (query: string) => void;
  onApplyFilters: (filters: FilterValues) => void;
}

const DiscoverTab: React.FC<DiscoverTabProps> = ({ professionals, pendingConnections, handleConnect, handleSendMessage, handleSearch, onApplyFilters }) => {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-auto md:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search by name, role, or genre..." 
            className="pl-10 w-full" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterDrawer onApplyFilters={onApplyFilters}>
            <Button variant="outline">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </FilterDrawer>
          <Button className="btn-premium" onClick={() => handleSearch(searchQuery)}>
            Search
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {professionals.map((professional) => (
          <ProfessionalCard 
            key={professional.id} 
            professional={professional} 
            handleConnect={handleConnect}
            handleSendMessage={handleSendMessage}
            isPending={pendingConnections.includes(professional.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default DiscoverTab;
