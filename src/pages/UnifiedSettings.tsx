
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { ArrowLeft, User, Bell, Shield, Palette, Globe, Settings as SettingsIcon } from 'lucide-react';

// Import existing settings components
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import CulturalProfileSetup from '@/components/cultural/CulturalProfileSetup';

// Import settings sections
import AccountSettings from '@/components/settings/AccountSettings';
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import CulturalSettings from '@/components/settings/CulturalSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';

const UnifiedSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('account');

  const settingsSections = [
    {
      id: 'account',
      label: 'Account',
      icon: <User className="w-4 h-4" />,
      description: 'Manage your account settings and security',
      component: AccountSettings
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      description: 'Update your profile information and portfolio',
      component: ProfileSettings
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      description: 'Configure how you receive notifications',
      component: NotificationSettings
    },
    {
      id: 'cultural',
      label: 'Cultural Profile',
      icon: <Globe className="w-4 h-4" />,
      description: 'Set up your cultural background and preferences',
      component: CulturalSettings
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: <Palette className="w-4 h-4" />,
      description: 'Customize the look and feel of the application',
      component: AppearanceSettings
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: <Shield className="w-4 h-4" />,
      description: 'Manage your privacy settings and security preferences',
      component: PrivacySettings
    }
  ];

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const renderActiveSection = () => {
    const activeSection = settingsSections.find(section => section.id === activeTab);
    if (!activeSection) return null;

    const Component = activeSection.component;
    return <Component />;
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToDashboard}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <SettingsIcon className="w-8 h-8" />
                Settings
              </h1>
              <p className="text-muted-foreground">Manage your account and application preferences</p>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={handleBackToDashboard} className="cursor-pointer">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
            {activeTab && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {settingsSections.find(s => s.id === activeTab)?.label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Settings Navigation Sidebar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings Menu</CardTitle>
                <CardDescription>Choose a category to configure</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {settingsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        activeTab === section.id
                          ? 'bg-primary/10 text-primary border-r-2 border-primary'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {section.icon}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{section.label}</div>
                        <div className="text-xs opacity-70 truncate">{section.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-9">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSettings;
