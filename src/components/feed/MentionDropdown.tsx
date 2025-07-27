
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface MentionDropdownProps {
  suggestions: Profile[];
  onSelect: (user: Profile) => void;
  isVisible: boolean;
  loading?: boolean;
}

export default function MentionDropdown({ 
  suggestions, 
  onSelect, 
  isVisible, 
  loading = false 
}: MentionDropdownProps) {
  if (!isVisible) return null;

  return (
    <Card className="absolute z-50 w-64 max-h-48 overflow-y-auto bg-background border shadow-lg">
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Searching...
          </div>
        ) : suggestions.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No users found
          </div>
        ) : (
          <div className="py-2">
            {suggestions.map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start p-2 h-auto"
                onClick={() => onSelect(user)}
              >
                <Avatar className="w-8 h-8 mr-3">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">
                    {user.full_name || 'Anonymous'}
                  </span>
                  {user.username && (
                    <span className="text-xs text-muted-foreground">
                      @{user.username}
                    </span>
                  )}
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
