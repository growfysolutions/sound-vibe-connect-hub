
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedGigManagement } from '@/components/gigs/AdvancedGigManagement';
import { EventsManager } from '@/components/community/EventsManager';
import { ThirdPartyIntegrations } from '@/components/integrations/ThirdPartyIntegrations';
import { CulturalExpansion } from '@/components/cultural/CulturalExpansion';

const PlatformExpansion = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient-primary">
            Platform Expansion Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Experience the next generation of music collaboration and cultural exchange
          </p>
        </div>

        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace">Advanced Marketplace</TabsTrigger>
            <TabsTrigger value="community">Community Features</TabsTrigger>
            <TabsTrigger value="integrations">Third-party Integrations</TabsTrigger>
            <TabsTrigger value="cultural">Cultural Expansion</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="mt-6">
            <AdvancedGigManagement />
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <EventsManager />
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <ThirdPartyIntegrations />
          </TabsContent>

          <TabsContent value="cultural" className="mt-6">
            <CulturalExpansion />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlatformExpansion;
