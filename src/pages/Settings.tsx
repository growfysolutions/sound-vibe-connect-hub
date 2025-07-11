import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setEmail(user.email || '');
      }
    };
    fetchUser();
  }, []);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !email) return;

    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      toast.error('Failed to update email. Please check the console.');
      console.error('Email update error:', error);
    } else {
      toast.success('Email update initiated. Please check your inbox to confirm.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error('Failed to update password.');
      console.error('Password update error:', error);
    } else {
      toast.success('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </header>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <Button type="submit">Update Email</Button>
                </form>
                <Separator />
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                   <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="text-lg font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">Select the theme for the dashboard.</p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="text-lg font-medium">Connection Requests</h3>
                    <p className="text-sm text-muted-foreground">Receive email notifications for new connection requests.</p>
                  </div>
                  <Switch disabled />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="text-lg font-medium">New Messages</h3>
                    <p className="text-sm text-muted-foreground">Receive email notifications for new direct messages.</p>
                  </div>
                  <Switch disabled />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="text-lg font-medium">Project Invites</h3>
                    <p className="text-sm text-muted-foreground">Receive email notifications for new project collaboration invites.</p>
                  </div>
                  <Switch disabled />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">Notification preferences are currently under development.</p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;

