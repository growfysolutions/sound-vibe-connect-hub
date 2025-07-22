
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Quote, Music, Sparkles } from 'lucide-react';

interface DailyInspiration {
  quote: {
    english: string;
    punjabi: string;
    author: string;
  };
  fact: {
    title: string;
    content: string;
    period: string;
  };
  raag: {
    name: string;
    punjabi: string;
    description: string;
    mood: string;
    timeOfDay: string;
    audioSample?: string;
  };
}

export function TodaysInspirationWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState<'quote' | 'fact' | 'raag'>('quote');

  const dailyContent: DailyInspiration = {
    quote: {
      english: "Music is the bridge between earth and heaven",
      punjabi: "ਸੰਗੀਤ ਧਰਤੀ ਅਤੇ ਸਵਰਗ ਵਿਚਕਾਰ ਪੁਲ ਹੈ",
      author: "Ustad Nusrat Fateh Ali Khan"
    },
    fact: {
      title: "The Birth of Bhangra",
      content: "Bhangra originated in the Punjab region during the harvest festival of Baisakhi, celebrating the joy of farming communities.",
      period: "15th Century"
    },
    raag: {
      name: "Raag Yaman",
      punjabi: "ਰਾਗ ਯਮਨ",
      description: "A melodic framework perfect for evening practice, known for its peaceful and devotional qualities.",
      mood: "Peaceful & Contemplative",
      timeOfDay: "Evening (6-9 PM)"
    }
  };

  const handlePlaySample = () => {
    setIsPlaying(!isPlaying);
    // Audio playback logic would go here
  };

  const renderQuoteSection = () => (
    <div className="text-center space-y-4 p-4 bg-gradient-to-r from-saffron/10 to-amber-500/10 rounded-lg">
      <Quote className="w-8 h-8 mx-auto text-saffron opacity-60" />
      <blockquote className="space-y-2">
        <p className="text-sm italic leading-relaxed">{dailyContent.quote.english}</p>
        <p className="text-sm opacity-75 font-serif">{dailyContent.quote.punjabi}</p>
      </blockquote>
      <cite className="text-xs text-muted-foreground block">— {dailyContent.quote.author}</cite>
    </div>
  );

  const renderFactSection = () => (
    <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">{dailyContent.fact.title}</h4>
        <Badge variant="outline" className="text-xs">{dailyContent.fact.period}</Badge>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{dailyContent.fact.content}</p>
    </div>
  );

  const renderRaagSection = () => (
    <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm">{dailyContent.raag.name}</h4>
          <p className="text-xs opacity-75 font-serif">{dailyContent.raag.punjabi}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={handlePlaySample}>
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{dailyContent.raag.description}</p>
      <div className="flex gap-2">
        <Badge variant="secondary" className="text-xs">{dailyContent.raag.mood}</Badge>
        <Badge variant="outline" className="text-xs">{dailyContent.raag.timeOfDay}</Badge>
      </div>
    </div>
  );

  return (
    <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-saffron" />
          <span>Today's Inspiration</span>
        </CardTitle>
        <div className="flex gap-1 mt-2">
          <Button
            size="sm"
            variant={currentSection === 'quote' ? 'default' : 'ghost'}
            onClick={() => setCurrentSection('quote')}
            className="text-xs h-7"
          >
            Quote
          </Button>
          <Button
            size="sm"
            variant={currentSection === 'fact' ? 'default' : 'ghost'}
            onClick={() => setCurrentSection('fact')}
            className="text-xs h-7"
          >
            History
          </Button>
          <Button
            size="sm"
            variant={currentSection === 'raag' ? 'default' : 'ghost'}
            onClick={() => setCurrentSection('raag')}
            className="text-xs h-7"
          >
            Raag
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {currentSection === 'quote' && renderQuoteSection()}
        {currentSection === 'fact' && renderFactSection()}
        {currentSection === 'raag' && renderRaagSection()}
      </CardContent>
    </Card>
  );
}
