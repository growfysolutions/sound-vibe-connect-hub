
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
      // Fetch accepted connections where user is the requester
      const { data: requesterConnections, error: requesterError } = await supabase
        .from('connections')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          requester_id,
          addressee_id
        `)
        .eq('requester_id', user.id)
        .eq('status', 'accepted');

      if (requesterError) throw requesterError;

      // Fetch accepted connections where user is the addressee
      const { data: addresseeConnections, error: addresseeError } = await supabase
        .from('connections')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          requester_id,
          addressee_id
        `)
        .eq('addressee_id', user.id)
        .eq('status', 'accepted');

      if (addresseeError) throw addresseeError;

      // Get profile data for all connected users
      const connectedUserIds = [
        ...(requesterConnections?.map(c => c.addressee_id) || []),
        ...(addresseeConnections?.map(c => c.requester_id) || [])
      ];

      if (connectedUserIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', connectedUserIds);

        if (profilesError) throw profilesError;
        setConnections(profilesData || []);
      } else {
        setConnections([]);
      }

      // Fetch incoming connection requests
      const { data: incomingData, error: incomingError } = await supabase
        .from('connections')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          requester_id,
          addressee_id
        `)
        .eq('addressee_id', user.id)
        .eq('status', 'pending');

      if (incomingError) throw incomingError;

      // Get requester profiles for incoming requests
      const requesterIds = incomingData?.map(c => c.requester_id) || [];
      if (requesterIds.length > 0) {
        const { data: requestersData, error: requestersError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', requesterIds);

        if (requestersError) throw requestersError;

        const requestsWithProfiles = incomingData?.map(request => ({
          ...request,
          profiles: requestersData?.find(profile => profile.id === request.requester_id)
        })) || [];

        setIncomingRequests(requestsWithProfiles as Connection[]);
      } else {
        setIncomingRequests([]);
      }

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
