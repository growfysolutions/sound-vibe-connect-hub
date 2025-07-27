
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

interface FilterOptions {
  category: string;
  tags: string[];
  searchQuery: string;
}

interface FeedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  isVisible: boolean;
  onToggle: () => void;
}

const categories = [
  'All',
  'Music',
  'Production',
  'Collaboration',
  'Performance',
  'Education',
  'Technology',
  'News'
];

const popularTags = [
  'hiphop', 'rock', 'pop', 'electronic', 'jazz', 'classical',
  'beat', 'remix', 'cover', 'original', 'live', 'studio'
];

export default function FeedFilters({ onFiltersChange, isVisible, onToggle }: FeedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    tags: [],
    searchQuery: ''
  });

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      handleFilterChange({ tags: [...filters.tags, tag] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleFilterChange({ tags: filters.tags.filter(tag => tag !== tagToRemove) });
  };

  const clearFilters = () => {
    const clearedFilters = { category: 'All', tags: [], searchQuery: '' };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
        {(filters.category !== 'All' || filters.tags.length > 0 || filters.searchQuery) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {isVisible && (
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search posts..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange({ category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => 
                      filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
