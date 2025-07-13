import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

export interface FilterValues {
  roles: string[];
  experience: string;
  location: string;
  genres: string[];
}

interface FilterDrawerProps {
  trigger: React.ReactNode;
  onApplyFilters?: (filters: FilterValues) => void;
}

const professionalRoles = ['Singer', 'Music Director', 'Video Editor', 'Sound Engineer'];
const experienceLevels = ['Hobbyist (0-2 years)', 'Intermediate (2-5 years)', 'Professional (5+ years)'];
const musicGenres = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Folk', 'Country', 'Metal', 'Indie', 'Bollywood'];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ trigger, onApplyFilters }) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleRoleChange = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({
        roles: selectedRoles,
        experience: selectedExperience,
        location: selectedLocation,
        genres: selectedGenres,
      });
    }
  };

  const handleReset = () => {
    setSelectedRoles([]);
    setSelectedExperience('');
    setSelectedLocation('');
    setSelectedGenres([]);
    if (onApplyFilters) {
      onApplyFilters({
        roles: [],
        experience: '',
        location: '',
        genres: [],
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter Collaborators</h4>
            <p className="text-sm text-muted-foreground">
              Refine your search to find the perfect match.
            </p>
          </div>
          <div className="grid gap-6 p-4">
            <div>
              <h4 className="font-medium mb-2">Role</h4>
              <div className="space-y-2">
                {professionalRoles.map(role => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox 
                      id={role} 
                      onCheckedChange={() => handleRoleChange(role)} 
                      checked={selectedRoles.includes(role)}
                      className="rounded-md"
                    />
                    <Label htmlFor={role}>{role}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Experience Level</h4>
              <RadioGroup onValueChange={setSelectedExperience} value={selectedExperience}>
                {experienceLevels.map(level => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={level} />
                    <Label htmlFor={level}>{level}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h4 className="font-medium mb-2">Location</h4>
              <Input 
                placeholder="e.g., Mumbai, India"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              />
            </div>
            <div>
              <h4 className="font-medium mb-2">Genre</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {musicGenres.map(genre => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox 
                      id={genre} 
                      onCheckedChange={() => handleGenreChange(genre)} 
                      checked={selectedGenres.includes(genre)}
                      className="rounded-md"
                    />
                    <Label htmlFor={genre}>{genre}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button onClick={handleApply}>Apply Filters</Button>
              <Button variant="ghost" onClick={handleReset}>Reset</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};


