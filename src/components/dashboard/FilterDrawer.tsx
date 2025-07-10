import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';

export interface FilterValues {
  roles: string[];
  experience: string;
}

interface FilterDrawerProps {
  children: React.ReactNode;
  onApplyFilters: (filters: FilterValues) => void;
}

const professionalRoles = ['Singer', 'Music Director', 'Video Editor', 'Sound Engineer'];
const experienceLevels = ['Hobbyist (0-2 years)', 'Intermediate (2-5 years)', 'Professional (5+ years)'];

const FilterDrawer: React.FC<FilterDrawerProps> = ({ children, onApplyFilters }) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>('');

  const handleRoleChange = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      roles: selectedRoles,
      experience: selectedExperience,
    });
  };

  return (
    <Drawer>
      {children} {/* This will be the trigger button */}
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filter Collaborators</DrawerTitle>
            <DrawerDescription>Refine your search to find the perfect match.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 space-y-6">
            <div>
              <h4 className="font-medium mb-2">Role</h4>
              <div className="space-y-2">
                {professionalRoles.map(role => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox 
                      id={role} 
                      onCheckedChange={() => handleRoleChange(role)} 
                      checked={selectedRoles.includes(role)}
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
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button onClick={handleApply}>Apply Filters</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
