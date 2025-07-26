
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Profile, Project, Connection } from '@/types';
import { toast } from 'sonner';

export const useDashboardData = () => {
  const { user } = useAuth();
  const [professionals, setProfessionals] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [connections, setConnections] = useState<Profile[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Connection[]>([]);
  const [pendingConnections, setPendingConnections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id || '')
        .limit(10);

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast.error('Failed to load professionals');
    }
  };

  const fetchProjects = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    }
  };

  const fetchConnections = async () => {
    if (!user?.id) return;

    try {
      // Fetch accepted connections
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('connections')
        .select(`
          *,
          profiles!connections_addressee_id_fkey(*)
        `)
        .eq('requester_id', user.id)
        .eq('status', 'accepted');

      if (connectionsError) throw connectionsError;

      // Also fetch connections where user is the addressee
      const { data: addresseeConnections, error: addresseeError } = await supabase
        .from('connections')
        .select(`
          *,
          profiles!connections_requester_id_fkey(*)
        `)
        .eq('addressee_id', user.id)
        .eq('status', 'accepted');

      if (addresseeError) throw addresseeError;

      const allConnections = [
        ...(connectionsData?.map(c => c.profiles).filter(Boolean) || []),
        ...(addresseeConnections?.map(c => c.profiles).filter(Boolean) || [])
      ];

      setConnections(allConnections as Profile[]);

      // Fetch incoming connection requests
      const { data: incomingData, error: incomingError } = await supabase
        .from('connections')
        .select(`
          *,
          profiles!connections_requester_id_fkey(*)
        `)
        .eq('addressee_id', user.id)
        .eq('status', 'pending');

      if (incomingError) throw incomingError;
      setIncomingRequests(incomingData || []);

      // Fetch pending outgoing requests
      const { data: pendingData, error: pendingError } = await supabase
        .from('connections')
        .select('addressee_id')
        .eq('requester_id', user.id)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;
      setPendingConnections(pendingData?.map(p => p.addressee_id) || []);

    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Failed to load connections');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProfessionals(),
        fetchProjects(),
        fetchConnections()
      ]);
      setLoading(false);
    };

    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const handleConnect = async (targetUserId: string) => {
    if (!user?.id) {
      toast.error('Please log in to connect');
      return;
    }

    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          addressee_id: targetUserId,
          status: 'pending'
        });

      if (error) throw error;

      setPendingConnections(prev => [...prev, targetUserId]);
      toast.success('Connection request sent!');
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
    }
  };

  const handleRequestAction = async (connectionId: number, status: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status })
        .eq('id', connectionId);

      if (error) throw error;

      if (status === 'accepted') {
        await fetchConnections(); // Refresh connections
        toast.success('Connection request accepted!');
      } else {
        setIncomingRequests(prev => prev.filter(req => req.id !== connectionId));
        toast.success('Connection request declined');
      }
    } catch (error) {
      console.error('Error updating connection:', error);
      toast.error('Failed to update connection request');
    }
  };

  const refetchProjects = () => {
    fetchProjects();
  };

  return {
    professionals,
    projects,
    connections,
    incomingRequests,
    pendingConnections,
    loading,
    handleConnect,
    handleRequestAction,
    refetchProjects
  };
};
