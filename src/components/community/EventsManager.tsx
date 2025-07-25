
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Music, 
  Trophy, 
  Star,
  Plus,
  Filter,
  Share2,
  Heart,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'concert' | 'workshop' | 'competition' | 'meetup' | 'festival';
  date: string;
  time: string;
  location: string;
  venue?: string;
  capacity: number;
  price?: number;
  is_free: boolean;
  organizer_id: string;
  organizer_name: string;
  image_url?: string;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees_count: number;
  is_attending: boolean;
  created_at: string;
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
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  rules: string[];
  judges: string[];
  participants_count: number;
  submissions_count: number;
  status: 'upcoming' | 'accepting_submissions' | 'voting' | 'completed';
  entry_fee?: number;
  is_participating: boolean;
}

export const EventsManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    date: '',
    price: ''
  });

  useEffect(() => {
    // For now, we'll use mock data until the database types are updated
    fetchMockEvents();
    fetchMockCompetitions();
  }, [filters]);

  const fetchMockEvents = async () => {
    try {
      // Mock events data
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Summer Music Festival',
          description: 'Join us for an amazing summer music festival featuring local and international artists.',
          type: 'festival',
          date: '2024-08-15',
          time: '18:00',
          location: 'Central Park',
          venue: 'Main Stage',
          capacity: 5000,
          price: 50,
          is_free: false,
          organizer_id: 'user1',
          organizer_name: 'Music Events Co.',
          image_url: null,
          tags: ['music', 'festival', 'outdoor'],
          status: 'upcoming',
          attendees_count: 1250,
          is_attending: false,
          created_at: '2024-07-01T10:00:00Z'
        },
        {
          id: '2',
          title: 'Beat Making Workshop',
          description: 'Learn the fundamentals of beat making with professional producers.',
          type: 'workshop',
          date: '2024-08-10',
          time: '14:00',
          location: 'Studio Complex',
          venue: 'Room A',
          capacity: 20,
          price: 0,
          is_free: true,
          organizer_id: 'user2',
          organizer_name: 'Beat Academy',
          image_url: null,
          tags: ['workshop', 'production', 'beats'],
          status: 'upcoming',
          attendees_count: 15,
          is_attending: true,
          created_at: '2024-07-05T12:00:00Z'
        }
      ];

      // Apply filters
      let filteredEvents = mockEvents;
      if (filters.type) {
        filteredEvents = filteredEvents.filter(event => event.type === filters.type);
      }
      if (filters.location) {
        filteredEvents = filteredEvents.filter(event => 
          event.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.date) {
        filteredEvents = filteredEvents.filter(event => event.date >= filters.date);
      }

      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    }
  };

  const fetchMockCompetitions = async () => {
    try {
      // Mock competitions data
      const mockCompetitions: Competition[] = [
        {
          id: '1',
          title: 'Best Original Song 2024',
          description: 'Submit your best original song for a chance to win amazing prizes.',
          theme: 'Original Composition',
          start_date: '2024-08-01',
          end_date: '2024-09-30',
          submission_deadline: '2024-09-15',
          voting_deadline: '2024-09-25',
          prizes: {
            first: '$1000 + Recording Session',
            second: '$500 + Mixing Session',
            third: '$250 + Mastering Session'
          },
          rules: ['Original songs only', 'Maximum 4 minutes', 'Any genre accepted'],
          judges: ['Producer Mike', 'Artist Sarah', 'Label Rep John'],
          participants_count: 45,
          submissions_count: 32,
          status: 'accepting_submissions',
          entry_fee: 25,
          is_participating: false
        }
      ];

      setCompetitions(mockCompetitions);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      toast.error('Failed to load competitions');
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async (eventId: string) => {
    try {
      // Mock join event functionality
      toast.success('Successfully joined event!');
      
      // Update local state
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, is_attending: true, attendees_count: event.attendees_count + 1 }
          : event
      ));
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error('Failed to join event');
    }
  };

  const joinCompetition = async (competitionId: string) => {
    try {
      // Mock join competition functionality
      toast.success('Successfully joined competition!');
      
      // Update local state
      setCompetitions(competitions.map(comp => 
        comp.id === competitionId 
          ? { ...comp, is_participating: true, participants_count: comp.participants_count + 1 }
          : comp
      ));
    } catch (error) {
      console.error('Error joining competition:', error);
      toast.error('Failed to join competition');
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'concert': return <Music className="w-5 h-5" />;
      case 'workshop': return <Users className="w-5 h-5" />;
      case 'competition': return <Trophy className="w-5 h-5" />;
      case 'meetup': return <MessageCircle className="w-5 h-5" />;
      case 'festival': return <Star className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'concert': return 'bg-purple-500';
      case 'workshop': return 'bg-blue-500';
      case 'competition': return 'bg-yellow-500';
      case 'meetup': return 'bg-green-500';
      case 'festival': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getCompetitionStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'accepting_submissions': return 'bg-green-500';
      case 'voting': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)} text-white`}>
              {getEventTypeIcon(event.type)}
            </div>
            <div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <p className="text-sm text-muted-foreground">by {event.organizer_name}</p>
            </div>
          </div>
          <Badge className={getEventTypeColor(event.type)}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            {event.venue ? `${event.venue}, ${event.location}` : event.location}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            {event.attendees_count} attending
          </div>
          {!event.is_free && event.price && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">${event.price}</span>
            </div>
          )}
          {event.is_free && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Free
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag, index) => (
            <Badge key={index} variant="outline">{tag}</Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Heart className="w-4 h-4" />
            Like
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          {!event.is_attending ? (
            <Button 
              onClick={() => joinEvent(event.id)}
              className="flex-1"
            >
              Join Event
            </Button>
          ) : (
            <Button variant="secondary" className="flex-1" disabled>
              Already Joined
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CompetitionCard = ({ competition }: { competition: Competition }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500 text-white">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{competition.title}</CardTitle>
              <p className="text-sm text-muted-foreground">Theme: {competition.theme}</p>
            </div>
          </div>
          <Badge className={getCompetitionStatusColor(competition.status)}>
            {competition.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">{competition.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            {new Date(competition.start_date).toLocaleDateString()} - {new Date(competition.end_date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            Submission deadline: {new Date(competition.submission_deadline).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            {competition.participants_count} participants
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="w-4 h-4 text-primary" />
            {competition.submissions_count} submissions
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <h4 className="font-medium mb-2">Prizes:</h4>
          <div className="text-sm space-y-1">
            <div>🥇 First: {competition.prizes.first}</div>
            <div>🥈 Second: {competition.prizes.second}</div>
            <div>🥉 Third: {competition.prizes.third}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            View Rules
          </Button>
          {!competition.is_participating ? (
            <Button 
              onClick={() => joinCompetition(competition.id)}
              className="flex-1"
            >
              Join Competition
            </Button>
          ) : (
            <Button variant="secondary" className="flex-1" disabled>
              Already Joined
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const FilterSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="concert">Concerts</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="competition">Competitions</SelectItem>
              <SelectItem value="meetup">Meetups</SelectItem>
              <SelectItem value="festival">Festivals</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />

          <Input
            type="date"
            placeholder="Date"
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
          />

          <Select value={filters.price} onValueChange={(value) => setFilters({...filters, price: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Events</h1>
          <p className="text-muted-foreground">
            Discover and join musical events and competitions
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Event Title" />
              <Textarea placeholder="Event Description" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="meetup">Meetup</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input type="date" placeholder="Date" />
                <Input type="time" placeholder="Time" />
              </div>
              <Input placeholder="Location" />
              <Input placeholder="Venue (optional)" />
              <div className="flex gap-4">
                <Input type="number" placeholder="Capacity" />
                <Input type="number" placeholder="Price (optional)" />
              </div>
              <Button className="w-full">Create Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="competitions">Competitions</TabsTrigger>
          <TabsTrigger value="my_events">My Events</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <FilterSection />
          
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my_events">
          <Card>
            <CardHeader>
              <CardTitle>My Events & Competitions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your joined events and competitions will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
