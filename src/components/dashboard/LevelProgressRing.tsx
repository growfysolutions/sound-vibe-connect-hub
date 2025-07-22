
import { useProfile } from '@/contexts/ProfileContext';
import { Badge } from '@/components/ui/badge';
import { Music, Star } from 'lucide-react';

export function LevelProgressRing({ collapsed }: { collapsed: boolean }) {
  const { profile } = useProfile();
  
  const userLevel = profile?.level || 1;
  const userXp = (profile as any)?.xp || 0;
  const xpForCurrentLevel = (userLevel - 1) * 1000;
  const progressPercentage = Math.min(((userXp - xpForCurrentLevel) / 1000) * 100, 100);
  
  const getLevelName = (level: number) => {
    const levelNames = {
      1: { en: 'Rising Star', pn: 'ਨਵਾਂ ਸਿਤਾਰਾ' },
      2: { en: 'Creative', pn: 'ਰਚਨਾਤਮਕ' },
      5: { en: 'Professional', pn: 'ਪੇਸ਼ੇਵਰ' },
      10: { en: 'Expert', pn: 'ਮਾਹਰ' },
      20: { en: 'Master', pn: 'ਉਸਤਾਦ' }
    } as const;
    
    const levelKey = Object.keys(levelNames)
      .reverse()
      .find(key => level >= parseInt(key));
    
    return levelNames[(levelKey ? parseInt(levelKey) : 1) as keyof typeof levelNames];
  };

  const levelName = getLevelName(userLevel);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(progressPercentage / 100) * circumference} ${circumference}`;

  if (collapsed) {
    return (
      <div className="flex flex-col items-center p-2">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--border))"
              strokeWidth="4"
              fill="none"
              className="opacity-20"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#progress-gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--saffron))" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-saffron">{userLevel}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/30">
        {/* Circular Progress Ring */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="hsl(var(--border))"
                strokeWidth="3"
                fill="none"
                className="opacity-20"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#progress-gradient-full)"
                strokeWidth="3"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out drop-shadow-lg"
              />
              <defs>
                <linearGradient id="progress-gradient-full" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--saffron))" />
                  <stop offset="50%" stopColor="#FF9500" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-saffron">{userLevel}</span>
              <Star className="w-3 h-3 text-amber-500" />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            {/* Bilingual level title */}
            <div>
              <h4 className="font-semibold text-foreground">
                Level {userLevel}: {levelName.en}
              </h4>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: 'serif' }}>
                ਪੱਚ {userLevel}: {levelName.pn}
              </p>
            </div>
            
            {/* XP with musical notes */}
            <div className="flex items-center space-x-1 text-sm">
              <Music className="w-3 h-3 text-saffron" />
              <span className="font-medium text-saffron">
                {userXp - xpForCurrentLevel} / 1000 XP
              </span>
            </div>
          </div>
        </div>
        
        {/* Achievement streak indicator */}
        <div className="flex items-center justify-between text-xs">
          <Badge variant="outline" className="text-xs border-saffron/30 text-saffron">
            🔥 3 Day Streak
          </Badge>
          <span className="text-muted-foreground">
            Next: {levelName.en} Pro
          </span>
        </div>
      </div>
    </div>
  );
}
