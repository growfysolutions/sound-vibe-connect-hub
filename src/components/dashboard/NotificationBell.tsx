import { useState, useEffect } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from '@/types/supabase';
import { Link } from 'react-router-dom';


export type Notification = Database['public']['Tables']['notifications']['Row'];

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select(`*`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
    } else if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('New notification received:', payload);
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (notificationId: number) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', unreadIds);

    if (error) {
      console.error('Error marking all as read:', error);
    } else {
      fetchNotifications();
    }
  };

  const renderNotificationContent = (notification: Notification) => {
        const data = notification.data as any;
    const requesterName = data?.requesterName || 'Someone';

    switch (notification.type) {
      case 'proposal_accepted':
        return (
          <p>Your proposal for <Link to={`/gigs/${data.gigId}`} className="font-bold hover:underline">{data.gigTitle}</Link> has been accepted!</p>
        );
      case 'proposal_rejected':
        return (
          <p>Your proposal for <Link to={`/gigs/${data.gigId}`} className="font-bold hover:underline">{data.gigTitle}</Link> has been rejected.</p>
        );
      case 'connection_request':
        return (
          <p>You have a new connection request from <Link to={`/profile/${data.requesterId}`} className="font-bold hover:underline">{requesterName}</Link>.</p>
        );
      default:
        return <p>You have a new notification.</p>;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0.5 text-xs">{unreadCount}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
            <CardTitle className="text-lg">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Button variant="link" size="sm" onClick={markAllAsRead} className="h-auto p-0">
                Mark all as read
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-2 max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div key={notification.id} className={`p-2 rounded-lg flex items-start space-x-3 ${!notification.is_read ? 'bg-primary/10' : ''}`}>
                  <div className="pt-1">
                    <CheckCircle className={`w-5 h-5 ${notification.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 text-sm">
                    {renderNotificationContent(notification)}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                    {!notification.is_read && (
                      <Button variant="link" size="sm" onClick={() => markAsRead(notification.id)} className="h-auto p-0 mt-1 text-xs">
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No notifications yet.</p>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
