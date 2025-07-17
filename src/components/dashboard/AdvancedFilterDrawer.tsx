import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { X, SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export interface AdvancedFilterValues {
  roles: string[];
  experience: string;
  location: string;
  genres: string[];
  rating: number[];
  availability: string;
  skills: string[];
  collaborationStyles: string[];
  projectTypes: string[];
}

interface AdvancedFilterDrawerProps {
  trigger: React.ReactNode;
  onApplyFilters?: (filters: AdvancedFilterValues) => void;
  activeFilters?: AdvancedFilterValues;
}

const professionalRoles = ['Singer', 'Music Director', 'Video Editor', 'Sound Engineer', 'Producer', 'Songwriter', 'Mixer', 'Mastering Engineer'];
const experienceLevels = ['Hobbyist (0-2 years)', 'Intermediate (2-5 years)', 'Professional (5+ years)', 'Expert (10+ years)'];
const musicGenres = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Folk', 'Country', 'Metal', 'Indie', 'Bollywood', 'Reggae', 'Blues'];
const availabilityOptions = ['Available Now', 'Available in 1 week', 'Available in 1 month', 'Long-term projects only'];
const skillsOptions = ['Vocals', 'Guitar', 'Piano', 'Drums', 'Bass', 'Mixing', 'Mastering', 'Composition', 'Arrangement', 'Recording'];
const collaborationStylesOptions = ['Remote', 'In-person', 'Hybrid', 'Studio sessions', 'Live performances'];
const projectTypesOptions = ['Single track', 'EP', 'Album', 'Remix', 'Live recording', 'Podcast', 'Commercial'];

export const AdvancedFilterDrawer: React.FC<AdvancedFilterDrawerProps> = ({ 
  trigger, 
  onApplyFilters, 
  activeFilters 
}) => {
  const [filters, setFilters] = useState<AdvancedFilterValues>(activeFilters || {
    roles: [],
    experience: '',
    location: '',
    genres: [],
    rating: [0],
    availability: '',
    skills: [],
    collaborationStyles: [],
    projectTypes: [],
  });
  
  const [isOpen, setIsOpen] = useState(false);

  const handleArrayToggle = (array: string[], value: string, setter: (newArray: string[]) => void) => {
    setter(array.includes(value) ? array.filter(item => item !== value) : [...array, value]);
  };

  const updateFilter = (key: keyof AdvancedFilterValues, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters?.(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      roles: [],
      experience: '',
      location: '',
      genres: [],
      rating: [0],
      availability: '',
      skills: [],
      collaborationStyles: [],
      projectTypes: [],
    };
    setFilters(resetFilters);
    onApplyFilters?.(resetFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).flat().filter(Boolean).length;
  };

  const removeFilter = (category: keyof AdvancedFilterValues, value?: string) => {
    if (value && Array.isArray(filters[category])) {
      updateFilter(category, (filters[category] as string[]).filter(item => item !== value));
    } else {
      updateFilter(category, Array.isArray(filters[category]) ? [] : '');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Advanced Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Find the perfect collaborator with precise filtering options.
          </SheetDescription>
        </SheetHeader>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className="my-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-1">
              {filters.roles.map(role => (
                <Badge key={role} variant="outline" className="text-xs">
                  {role}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeFilter('roles', role)} />
                </Badge>
              ))}
              {filters.experience && (
                <Badge variant="outline" className="text-xs">
                  {filters.experience}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeFilter('experience')} />
                </Badge>
              )}
              {filters.genres.map(genre => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeFilter('genres', genre)} />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* Professional Roles */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Professional Roles</h4>
            <div className="grid grid-cols-2 gap-2">
              {professionalRoles.map(role => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox 
                    id={role} 
                    checked={filters.roles.includes(role)}
                    onCheckedChange={() => handleArrayToggle(filters.roles, role, (newRoles) => updateFilter('roles', newRoles))}
                  />
                  <Label htmlFor={role} className="text-sm">{role}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Experience Level */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Experience Level</h4>
            <RadioGroup 
              value={filters.experience} 
              onValueChange={(value) => updateFilter('experience', value)}
            >
              {experienceLevels.map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={level} />
                  <Label htmlFor={level} className="text-sm">{level}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Rating Filter */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Minimum Rating</h4>
            <div className="px-3">
              <Slider
                value={filters.rating}
                onValueChange={(value) => updateFilter('rating', value)}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Any</span>
                <span>{filters.rating[0]}+ stars</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Location</h4>
            <Input 
              placeholder="e.g., Mumbai, India or Remote"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>

          <Separator />

          {/* Music Genres */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Music Genres</h4>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {musicGenres.map(genre => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox 
                    id={genre} 
                    checked={filters.genres.includes(genre)}
                    onCheckedChange={() => handleArrayToggle(filters.genres, genre, (newGenres) => updateFilter('genres', newGenres))}
                  />
                  <Label htmlFor={genre} className="text-sm">{genre}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Availability */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Availability</h4>
            <RadioGroup 
              value={filters.availability} 
              onValueChange={(value) => updateFilter('availability', value)}
            >
              {availabilityOptions.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="text-sm">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Skills */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Skills</h4>
            <div className="grid grid-cols-2 gap-2">
              {skillsOptions.map(skill => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox 
                    id={skill} 
                    checked={filters.skills.includes(skill)}
                    onCheckedChange={() => handleArrayToggle(filters.skills, skill, (newSkills) => updateFilter('skills', newSkills))}
                  />
                  <Label htmlFor={skill} className="text-sm">{skill}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Collaboration Styles */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Collaboration Styles</h4>
            <div className="space-y-2">
              {collaborationStylesOptions.map(style => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox 
                    id={style} 
                    checked={filters.collaborationStyles.includes(style)}
                    onCheckedChange={() => handleArrayToggle(filters.collaborationStyles, style, (newStyles) => updateFilter('collaborationStyles', newStyles))}
                  />
                  <Label htmlFor={style} className="text-sm">{style}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Project Types */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Project Types</h4>
            <div className="grid grid-cols-2 gap-2">
              {projectTypesOptions.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={type} 
                    checked={filters.projectTypes.includes(type)}
                    onCheckedChange={() => handleArrayToggle(filters.projectTypes, type, (newTypes) => updateFilter('projectTypes', newTypes))}
                  />
                  <Label htmlFor={type} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleApply} className="flex-1">
            Apply Filters ({getActiveFilterCount()})
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset All
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};