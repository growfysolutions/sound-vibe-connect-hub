
import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';

interface CulturalNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  cultural_context: any;
  sound_alert: string | null;
  is_read: boolean;
  priority: string;
  created_at: string;
}

export const useCulturalNotifications = () => {
  const { profile } = useProfile();
  const [notifications, setNotifications] = useState<CulturalNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock implementation until database tables are available
  const fetchNotifications = async () => {
    if (!profile?.id) return;

    // Mock data for now
    const mockNotifications: CulturalNotification[] = [
      {
        id: '1',
        type: 'cultural_content',
        title: 'New Cultural Content Available',
        message: 'Traditional patterns have been added to the library',
        cultural_context: { category: 'traditional' },
        sound_alert: null,
        is_read: false,
        priority: 'normal',
        created_at: new Date().toISOString(),
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  useEffect(() => {
    if (profile?.id) {
      fetchNotifications();
    }
  }, [profile?.id]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};
