
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, EyeOff, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

const PrivacySettings = () => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // public, connections, private
    showOnlineStatus: true,
    allowDirectMessages: true,
    showLocation: true,
    showEmail: false,
    allowTagging: true,
    showActivity: true,
    allowSearchEngines: true,
    dataCollection: true,
    marketingEmails: false,
  });

  const handlePrivacyChange = (setting: string, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSaveSettings = () => {
    toast.success('Privacy settings updated successfully!');
  };

  const handleDataExport = () => {
    toast.info('Data export request submitted. You will receive an email with your data within 24 hours.');
  };

  return (
    <div className="space-y-6">
      {/* Privacy Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Control your privacy settings and data sharing preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">Who can see your profile</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Data Protection</p>
                  <p className="text-sm text-muted-foreground">Your data security settings</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Profile Privacy
          </CardTitle>
          <CardDescription>
            Control who can see your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Show Online Status</Label>
              <p className="text-sm text-muted-foreground">Display when you're online to other users</p>
            </div>
            <Switch
              checked={privacySettings.showOnlineStatus}
              onCheckedChange={(value) => handlePrivacyChange('showOnlineStatus', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Allow Direct Messages</Label>
              <p className="text-sm text-muted-foreground">Let other users send you direct messages</p>
            </div>
            <Switch
              checked={privacySettings.allowDirectMessages}
              onCheckedChange={(value) => handlePrivacyChange('allowDirectMessages', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Show Location</Label>
              <p className="text-sm text-muted-foreground">Display your location on your profile</p>
            </div>
            <Switch
              checked={privacySettings.showLocation}
              onCheckedChange={(value) => handlePrivacyChange('showLocation', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Show Email</Label>
              <p className="text-sm text-muted-foreground">Make your email address visible to connections</p>
            </div>
            <Switch
              checked={privacySettings.showEmail}
              onCheckedChange={(value) => handlePrivacyChange('showEmail', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Allow Tagging</Label>
              <p className="text-sm text-muted-foreground">Let others tag you in posts and projects</p>
            </div>
            <Switch
              checked={privacySettings.allowTagging}
              onCheckedChange={(value) => handlePrivacyChange('allowTagging', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Data & Analytics
          </CardTitle>
          <CardDescription>
            Manage your data collection and usage preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Activity Tracking</Label>
              <p className="text-sm text-muted-foreground">Show your activity status to connections</p>
            </div>
            <Switch
              checked={privacySettings.showActivity}
              onCheckedChange={(value) => handlePrivacyChange('showActivity', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Search Engine Indexing</Label>
              <p className="text-sm text-muted-foreground">Allow search engines to index your public profile</p>
            </div>
            <Switch
              checked={privacySettings.allowSearchEngines}
              onCheckedChange={(value) => handlePrivacyChange('allowSearchEngines', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Data Collection</Label>
              <p className="text-sm text-muted-foreground">Allow collection of usage data to improve service</p>
            </div>
            <Switch
              checked={privacySettings.dataCollection}
              onCheckedChange={(value) => handlePrivacyChange('dataCollection', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive promotional emails and newsletters</p>
            </div>
            <Switch
              checked={privacySettings.marketingEmails}
              onCheckedChange={(value) => handlePrivacyChange('marketingEmails', value)}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Data Export</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Download a copy of your personal data including profile information, posts, and activity history.
              </p>
              <Button onClick={handleDataExport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Request Data Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <Card>
        <CardContent className="pt-6">
          <Button onClick={handleSaveSettings} className="w-full">
            Save Privacy Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySettings;
