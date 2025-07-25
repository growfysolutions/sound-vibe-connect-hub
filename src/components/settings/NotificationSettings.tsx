
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, MessageSquare, Users, Briefcase, Calendar, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCulturalNotifications } from '@/hooks/useCulturalNotifications';

const NotificationSettings = () => {
  const { unreadCount, markAllAsRead } = useCulturalNotifications();
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      connectionRequests: true,
      newMessages: true,
      projectInvites: true,
      gigUpdates: true,
      systemUpdates: false,
      culturalUpdates: true,
    },
    push: {
      connectionRequests: true,
      newMessages: true,
      projectInvites: true,
      gigUpdates: false,
      systemUpdates: false,
      culturalUpdates: true,
    },
    frequency: 'immediate', // immediate, daily, weekly
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
    soundAlerts: true,
  });

  const handleSettingChange = (category: 'email' | 'push', setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    toast.success('Notification settings saved successfully!');
  };

  const notificationTypes = [
    {
      id: 'connectionRequests',
      label: 'Connection Requests',
      description: 'New connection requests from other users',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'newMessages',
      label: 'New Messages',
      description: 'Direct messages and chat notifications',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'projectInvites',
      label: 'Project Invitations',
      description: 'Invitations to collaborate on projects',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'gigUpdates',
      label: 'Gig Updates',
      description: 'Updates about your gigs and applications',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'culturalUpdates',
      label: 'Cultural Content',
      description: 'Updates about cultural events and content',
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: 'systemUpdates',
      label: 'System Updates',
      description: 'Platform updates and maintenance notifications',
      icon: <Bell className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Overview
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Unread Notifications</p>
                  <p className="text-sm text-muted-foreground">Current unread count</p>
                </div>
                <Badge variant="secondary">{unreadCount}</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Active email alerts</p>
                </div>
                <Badge variant="default">
                  {Object.values(notificationSettings.email).filter(Boolean).length}
                </Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Active push alerts</p>
                </div>
                <Badge variant="default">
                  {Object.values(notificationSettings.push).filter(Boolean).length}
                </Badge>
              </div>
            </div>
          </div>
          {unreadCount > 0 && (
            <div className="mt-4">
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                Mark All as Read
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Configure which notifications you receive via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {type.icon}
                <div>
                  <Label className="font-medium">{type.label}</Label>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.email[type.id as keyof typeof notificationSettings.email]}
                onCheckedChange={(value) => handleSettingChange('email', type.id, value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Configure which notifications you receive as push notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {type.icon}
                <div>
                  <Label className="font-medium">{type.label}</Label>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.push[type.id as keyof typeof notificationSettings.push]}
                onCheckedChange={(value) => handleSettingChange('push', type.id, value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Customize how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select
              value={notificationSettings.frequency}
              onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, frequency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Summary</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Sound Alerts</Label>
              <p className="text-sm text-muted-foreground">Play sounds for new notifications</p>
            </div>
            <Switch
              checked={notificationSettings.soundAlerts}
              onCheckedChange={(value) => setNotificationSettings(prev => ({ ...prev, soundAlerts: value }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">Pause notifications during specified hours</p>
            </div>
            <Switch
              checked={notificationSettings.quietHours.enabled}
              onCheckedChange={(value) => setNotificationSettings(prev => ({
                ...prev,
                quietHours: { ...prev.quietHours, enabled: value }
              }))}
            />
          </div>

          {notificationSettings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select
                  value={notificationSettings.quietHours.startTime}
                  onValueChange={(value) => setNotificationSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, startTime: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="21:00">9:00 PM</SelectItem>
                    <SelectItem value="22:00">10:00 PM</SelectItem>
                    <SelectItem value="23:00">11:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Select
                  value={notificationSettings.quietHours.endTime}
                  onValueChange={(value) => setNotificationSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, endTime: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Settings */}
      <Card>
        <CardContent className="pt-6">
          <Button onClick={handleSaveSettings} className="w-full">
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
