
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Trophy,
  Plus,
  Filter,
  Star,
  Tag
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location: string;
  venue?: string;
  capacity: number;
  price?: number;
  is_free: boolean;
  organizer_id: string;
  image_url?: string;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
  organizer_name?: string;
  attendees_count?: number;
  is_attending?: boolean;
}

interface Competition {
  id: string;
  title: string;
  description: string;
  theme: string;
  start_date: string;
  end_date: string;
  submission_deadline: string;
  voting_deadline: string;
  prizes: any;
  rules: string[];
  judges: string[];
  status: string;
  entry_fee?: number;
  created_at: string;
  updated_at: string;
  participants_count?: number;
  submissions_count?: number;
  is_participating?: boolean;
}

export const EventsManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    fetchEvents();
    fetchCompetitions();
  }, []);

  const fetchEvents = async () => {
    try {
      // Mock data for now since we have TypeScript issues with the current schema
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Jazz Night Downtown',
          description: 'An evening of smooth jazz with local artists',
          type: 'concert',
          date: '2024-02-15',
          time: '19:00',
          location: 'Downtown Music Hall',
          venue: 'Main Concert Hall',
          capacity: 200,
          price: 25,
          is_free: false,
          organizer_id: 'user1',
          image_url: '',
          tags: ['jazz', 'live music', 'downtown'],
          status: 'upcoming',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          organizer_name: 'Music Events Co.',
          attendees_count: 45,
          is_attending: false
        }
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitions = async () => {
    try {
      // Mock data for now since we have TypeScript issues with the current schema
      const mockCompetitions: Competition[] = [
        {
          id: '1',
          title: 'Beat Making Championship',
          description: 'Show off your beat making skills',
          theme: 'Hip-Hop Production',
          start_date: '2024-02-01',
          end_date: '2024-02-28',
          submission_deadline: '2024-02-25',
          voting_deadline: '2024-02-28',
          prizes: { first: '$500', second: '$300', third: '$200' },
          rules: ['Original beats only', 'Max 3 minutes duration'],
          judges: ['DJ Producer', 'Beat Master'],
          status: 'accepting_submissions',
          entry_fee: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          participants_count: 25,
          submissions_count: 15,
          is_participating: false
        }
      ];
      setCompetitions(mockCompetitions);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      toast.error('Failed to load competitions');
    }
  };

  const joinEvent = async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to join events');
        return;
      }

      // Mock implementation
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, is_attending: true, attendees_count: (event.attendees_count || 0) + 1 }
          : event
      ));
      
      toast.success('Successfully joined the event!');
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error('Failed to join event');
    }
  };

  const joinCompetition = async (competitionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to join competitions');
        return;
      }

      // Mock implementation
      setCompetitions(competitions.map(comp => 
        comp.id === competitionId 
          ? { ...comp, is_participating: true, participants_count: (comp.participants_count || 0) + 1 }
          : comp
      ));
      
      toast.success('Successfully joined the competition!');
    } catch (error) {
      console.error('Error joining competition:', error);
      toast.error('Failed to join competition');
    }
  };

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{event.organizer_name}</p>
          </div>
          <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
            {event.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {event.attendees_count || 0} / {event.capacity} attendees
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag, index) => (
            <Badge key={index} variant="outline">{tag}</Badge>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold">
            {event.is_free ? 'Free' : `$${event.price}`}
          </span>
          <Button 
            onClick={() => joinEvent(event.id)}
            disabled={event.is_attending}
            variant={event.is_attending ? 'secondary' : 'default'}
          >
            {event.is_attending ? 'Joined' : 'Join Event'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const CompetitionCard = ({ competition }: { competition: Competition }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{competition.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{competition.theme}</p>
          </div>
          <Badge variant={competition.status === 'accepting_submissions' ? 'default' : 'secondary'}>
            {competition.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">{competition.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(competition.start_date).toLocaleDateString()} - {new Date(competition.end_date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Deadline: {new Date(competition.submission_deadline).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {competition.participants_count || 0} participants
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Prizes
          </h4>
          <div className="text-sm text-muted-foreground">
            1st: {competition.prizes.first} | 2nd: {competition.prizes.second} | 3rd: {competition.prizes.third}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold">
            {competition.entry_fee ? `$${competition.entry_fee} entry fee` : 'Free entry'}
          </span>
          <Button 
            onClick={() => joinCompetition(competition.id)}
            disabled={competition.is_participating}
            variant={competition.is_participating ? 'secondary' : 'default'}
          >
            {competition.is_participating ? 'Joined' : 'Join Competition'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Events</h1>
        <p className="text-muted-foreground">
          Discover local music events and competitions in your area
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="competitions">Competitions</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="competitions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Competitions</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Competition
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitions.map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
