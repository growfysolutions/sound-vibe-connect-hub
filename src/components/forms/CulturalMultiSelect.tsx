
import React, { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface CulturalMultiSelectProps {
  options: Option[];
  placeholder?: string;
  value?: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export const CulturalMultiSelect: React.FC<CulturalMultiSelectProps> = ({
  options,
  placeholder = "Select options...",
  value = [],
  onChange,
  className
}) => {
  const [open, setOpen] = useState(false);

  const selectedOptions = options.filter(option => value.includes(option.value));

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemove = (optionValue: string) => {
    const newValue = value.filter(v => v !== optionValue);
    onChange(newValue);
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between min-h-[40px] h-auto bg-gradient-to-r from-background to-background/95",
              "border-2 border-saffron/20 hover:border-saffron/40 focus:border-saffron",
              "transition-all duration-200"
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="bg-saffron/20 text-saffron-foreground hover:bg-saffron/30"
                  >
                    {option.icon && <span className="mr-1">{option.icon}</span>}
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(option.value);
                      }}
                      className="ml-1 hover:bg-saffron/40 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer hover:bg-saffron/10"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
