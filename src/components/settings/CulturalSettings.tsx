
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Star, Users, Music } from 'lucide-react';
import CulturalProfileSetup from '@/components/cultural/CulturalProfileSetup';

const CulturalSettings = () => {
  return (
    <div className="space-y-6">
      {/* Cultural Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Cultural Profile Overview
          </CardTitle>
          <CardDescription>
            Enhance your profile with cultural background and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Cultural Specialties</p>
                  <p className="text-sm text-muted-foreground">Your cultural focus areas</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Community Connection</p>
                  <p className="text-sm text-muted-foreground">Cultural network building</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Verification Status</p>
                  <p className="text-sm text-muted-foreground">Cultural authenticity</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cultural Profile Setup */}
      <CulturalProfileSetup />
    </div>
  );
};

export default CulturalSettings;
