
import { useState } from 'react';
import { UserJourneyValidator } from '@/components/testing/UserJourneyValidator';
import { IntegrationIssuesTracker } from '@/components/testing/IntegrationIssuesTracker';
import { CulturalConsistencyChecker } from '@/components/testing/CulturalConsistencyChecker';
import { DesignSystemChecker } from '@/components/ui/DesignSystemChecker';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { culturalStyles } from '@/lib/cultural-design';
import { TestTube, Bug, CheckCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DesignSystemTesting() {
  const [activeTab, setActiveTab] = useState('journey-validation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className={cn(culturalStyles.typography.header, 'text-4xl', culturalStyles.colors.primary)}>
            SoundVibe Design System Testing
          </h1>
          <p className={cn(culturalStyles.typography.body, 'text-lg text-muted-foreground')}>
            Comprehensive validation of cultural design consistency and user journey integration
          </p>
          <div className="text-sm" style={{ fontFamily: 'serif' }}>
            ਸਾਊਂਡਵਾਈਬ ਡਿਜ਼ਾਈਨ ਸਿਸਟਮ ਜਾਂਚ
          </div>
        </div>

        {/* Testing Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-saffron/10 to-amber-500/10 border border-saffron/20">
            <TabsTrigger 
              value="journey-validation" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-saffron/20 data-[state=active]:to-amber-500/20"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Journey Tests
            </TabsTrigger>
            <TabsTrigger 
              value="issues-tracker"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-saffron/20 data-[state=active]:to-amber-500/20"
            >
              <Bug className="w-4 h-4 mr-2" />
              Issue Tracker
            </TabsTrigger>
            <TabsTrigger 
              value="consistency-checker"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-saffron/20 data-[state=active]:to-amber-500/20"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Consistency
            </TabsTrigger>
            <TabsTrigger 
              value="compliance-checker"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-saffron/20 data-[state=active]:to-amber-500/20"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journey-validation" className="space-y-6">
            <UserJourneyValidator />
          </TabsContent>

          <TabsContent value="issues-tracker" className="space-y-6">
            <IntegrationIssuesTracker />
          </TabsContent>

          <TabsContent value="consistency-checker" className="space-y-6">
            <CulturalConsistencyChecker />
          </TabsContent>

          <TabsContent value="compliance-checker" className="space-y-6">
            <DesignSystemChecker />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-saffron/10 to-amber-500/10 border border-saffron/20 rounded-xl p-6">
          <h3 className={cn(culturalStyles.typography.subheader, 'mb-4')}>
            Quick Testing Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CulturalButton variant="primary" className="w-full">
              🔍 Run Full System Scan
            </CulturalButton>
            <CulturalButton variant="secondary" className="w-full">
              📊 Generate Testing Report
            </CulturalButton>
            <CulturalButton variant="secondary" className="w-full">
              🎯 Focus on Critical Issues
            </CulturalButton>
          </div>
        </div>

        {/* Testing Guidelines */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 p-6 border border-saffron/20 rounded-xl bg-gradient-to-br from-saffron/5 to-background">
            <h4 className={cn(culturalStyles.typography.subheader, culturalStyles.colors.primary)}>
              🎯 Testing Priorities
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• User-blocking navigation issues (Critical)</li>
              <li>• Cultural design inconsistencies (High)</li>
              <li>• Mobile responsiveness problems (High)</li>
              <li>• Performance with cultural assets (Medium)</li>
              <li>• Punjabi text rendering (Medium)</li>
              <li>• Animation smoothness (Low)</li>
            </ul>
          </div>

          <div className="space-y-4 p-6 border border-saffron/20 rounded-xl bg-gradient-to-br from-amber-500/5 to-background">
            <h4 className={cn(culturalStyles.typography.subheader, culturalStyles.colors.primary)}>
              🧪 Testing Checklist
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ All buttons use CulturalButton component</li>
              <li>✅ Cards include cultural pattern backgrounds</li>
              <li>✅ Forms use cultural validation styling</li>
              <li>✅ Navigation includes cultural elements</li>
              <li>⏳ Mobile optimization complete</li>
              <li>⏳ Punjabi font support verified</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
