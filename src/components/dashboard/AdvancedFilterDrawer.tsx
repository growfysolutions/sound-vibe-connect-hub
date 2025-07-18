import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Filter, MapPin, Star, TrendingUp, Clock } from 'lucide-react';

interface AdvancedFilters {
  roles: string[];
  experience: string;
  location: string;
  genres: string[];
  rating: number[];
  availability: string;
  projectTypes: string[];
  collaborationStyle: string[];
  priceRange: number[];
  skills: string[];
  verifiedOnly: boolean;
  hasPortfolio: boolean;
  recentlyActive: boolean;
}

interface AdvancedFilterDrawerProps {
  trigger: React.ReactNode;
  onApplyFilters?: (filters: AdvancedFilters) => void;
  onResetFilters?: () => void;
}

const PROFESSIONAL_ROLES = [
  'Producer', 'Mixing Engineer', 'Mastering Engineer', 'Sound Designer', 
  'Composer', 'Songwriter', 'Vocalist', 'Instrumentalist', 'DJ', 'Audio Engineer'
];

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional', 'Expert'];

const MUSIC_GENRES = [
  'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Country', 
  'R&B', 'Reggae', 'Blues', 'Folk', 'Alternative', 'Indie', 'Metal'
];

const PROJECT_TYPES = [
  'Album Production', 'Single Track', 'EP', 'Live Recording', 'Podcast', 
  'Commercial', 'Film Score', 'Game Audio', 'Remix', 'Cover Song'
];

const COLLABORATION_STYLES = [
  'Remote Only', 'In-Person Only', 'Hybrid', 'Flexible', 'Studio Sessions', 'Home Studio'
];

const SKILLS = [
  'Pro Tools', 'Logic Pro', 'Ableton Live', 'FL Studio', 'Cubase', 'Reaper',
  'Mixing', 'Mastering', 'Recording', 'MIDI Programming', 'Sound Design', 'Vocals'
];

export function AdvancedFilterDrawer({ trigger, onApplyFilters, onResetFilters }: AdvancedFilterDrawerProps) {
  const [filters, setFilters] = useState<AdvancedFilters>({
    roles: [],
    experience: '',
    location: '',
    genres: [],
    rating: [0],
    availability: '',
    projectTypes: [],
    collaborationStyle: [],
    priceRange: [0, 10000],
    skills: [],
    verifiedOnly: false,
    hasPortfolio: false,
    recentlyActive: false,
  });

  const handleRoleChange = (role: string) => {
    setFilters(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleGenreChange = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleProjectTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter(t => t !== type)
        : [...prev.projectTypes, type]
    }));
  };

  const handleCollaborationStyleChange = (style: string) => {
    setFilters(prev => ({
      ...prev,
      collaborationStyle: prev.collaborationStyle.includes(style)
        ? prev.collaborationStyle.filter(s => s !== style)
        : [...prev.collaborationStyle, style]
    }));
  };

  const handleSkillChange = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleApply = () => {
    onApplyFilters?.(filters);
  };

  const handleReset = () => {
    const resetFilters: AdvancedFilters = {
      roles: [],
      experience: '',
      location: '',
      genres: [],
      rating: [0],
      availability: '',
      projectTypes: [],
      collaborationStyle: [],
      priceRange: [0, 10000],
      skills: [],
      verifiedOnly: false,
      hasPortfolio: false,
      recentlyActive: false,
    };
    setFilters(resetFilters);
    onResetFilters?.();
  };

  const activeFiltersCount = [
    ...filters.roles,
    ...filters.genres,
    ...filters.projectTypes,
    ...filters.collaborationStyle,
    ...filters.skills,
    filters.experience,
    filters.location,
    filters.availability,
  ].filter(Boolean).length + 
  (filters.verifiedOnly ? 1 : 0) + 
  (filters.hasPortfolio ? 1 : 0) + 
  (filters.recentlyActive ? 1 : 0) +
  (filters.rating[0] > 0 ? 1 : 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          {trigger}
          {activeFiltersCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-h-[600px] overflow-y-auto" align="end">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Advanced Filters
            </h3>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset All
            </Button>
          </div>

          {/* Professional Roles */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Professional Roles</Label>
            <div className="grid grid-cols-2 gap-2">
              {PROFESSIONAL_ROLES.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={filters.roles.includes(role)}
                    onCheckedChange={() => handleRoleChange(role)}
                  />
                  <Label htmlFor={`role-${role}`} className="text-sm">{role}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Experience Level</Label>
            <RadioGroup 
              value={filters.experience} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={`exp-${level}`} />
                  <Label htmlFor={`exp-${level}`} className="text-sm">{level}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              placeholder="Enter city, state, or country"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Star className="w-4 h-4" />
              Minimum Rating: {filters.rating[0]} stars
            </Label>
            <Slider
              value={filters.rating}
              onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
          </div>

          {/* Genres */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Music Genres</Label>
            <div className="flex flex-wrap gap-2">
              {MUSIC_GENRES.map((genre) => (
                <Badge
                  key={genre}
                  variant={filters.genres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleGenreChange(genre)}
                >
                  {genre}
                  {filters.genres.includes(genre) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Project Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Project Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {PROJECT_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`project-${type}`}
                    checked={filters.projectTypes.includes(type)}
                    onCheckedChange={() => handleProjectTypeChange(type)}
                  />
                  <Label htmlFor={`project-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Collaboration Style */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Collaboration Style</Label>
            <div className="grid grid-cols-2 gap-2">
              {COLLABORATION_STYLES.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox
                    id={`collab-${style}`}
                    checked={filters.collaborationStyle.includes(style)}
                    onCheckedChange={() => handleCollaborationStyleChange(style)}
                  />
                  <Label htmlFor={`collab-${style}`} className="text-sm">{style}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Software */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Skills & Software</Label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <Badge
                  key={skill}
                  variant={filters.skills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleSkillChange(skill)}
                >
                  {skill}
                  {filters.skills.includes(skill) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Additional Filters</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={filters.verifiedOnly}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verifiedOnly: !!checked }))}
                />
                <Label htmlFor="verified" className="text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Verified professionals only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="portfolio"
                  checked={filters.hasPortfolio}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasPortfolio: !!checked }))}
                />
                <Label htmlFor="portfolio" className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Has portfolio
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={filters.recentlyActive}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, recentlyActive: !!checked }))}
                />
                <Label htmlFor="active" className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Recently active
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}