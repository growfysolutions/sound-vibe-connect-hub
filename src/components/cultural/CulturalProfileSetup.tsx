
import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCulturalProfile } from '@/hooks/useCulturalProfile';
import { toast } from 'sonner';

const culturalSpecialties = ['traditional', 'folk', 'bhangra', 'sufi', 'qawwali', 'gurbani'];
const culturalThemes = ['religious', 'celebratory', 'romantic', 'patriotic', 'spiritual', 'festive'];
const languages = ['punjabi', 'english', 'both'];

const CulturalProfileSetup = () => {
  const { culturalProfile, updateCulturalProfile, loading } = useCulturalProfile();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    culturalProfile?.cultural_specialties || []
  );
  const [selectedThemes, setSelectedThemes] = useState<string[]>(
    culturalProfile?.cultural_themes || []
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    culturalProfile?.preferred_language || 'english'
  );
  const [culturalBackground, setCulturalBackground] = useState(
    culturalProfile?.cultural_background || ''
  );

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme)
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const handleSave = async () => {
    const success = await updateCulturalProfile({
      cultural_specialties: selectedSpecialties,
      cultural_themes: selectedThemes,
      preferred_language: selectedLanguage,
      cultural_background: culturalBackground
    });

    if (success) {
      toast.success('Cultural profile updated successfully!');
    } else {
      toast.error('Failed to update cultural profile');
    }
  };

  if (loading) {
    return <div>Loading cultural profile...</div>;
  }

  return (
    <Card className="floating-card">
      <CardHeader>
        <h3 className="text-xl font-semibold">Cultural Profile Setup</h3>
        <p className="text-muted-foreground">
          Help us understand your cultural background and musical preferences
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Preferred Language</Label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select your preferred language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Cultural Specialties</Label>
          <div className="grid grid-cols-2 gap-2">
            {culturalSpecialties.map(specialty => (
              <Badge
                key={specialty}
                variant={selectedSpecialties.includes(specialty) ? "default" : "outline"}
                className="cursor-pointer justify-center p-2"
                onClick={() => toggleSpecialty(specialty)}
              >
                {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Cultural Themes</Label>
          <div className="grid grid-cols-2 gap-2">
            {culturalThemes.map(theme => (
              <Badge
                key={theme}
                variant={selectedThemes.includes(theme) ? "default" : "outline"}
                className="cursor-pointer justify-center p-2"
                onClick={() => toggleTheme(theme)}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="cultural-background" className="text-base font-medium mb-3 block">
            Cultural Background
          </Label>
          <Textarea
            id="cultural-background"
            placeholder="Tell us about your cultural heritage, traditions, or musical influences..."
            value={culturalBackground}
            onChange={(e) => setCulturalBackground(e.target.value)}
            rows={4}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Cultural Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default CulturalProfileSetup;
