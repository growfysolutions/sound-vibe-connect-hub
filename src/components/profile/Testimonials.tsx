import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { useToast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

type TestimonialWithAuthor = Database['public']['Tables']['testimonials']['Row'] & {
  author: Database['public']['Tables']['profiles']['Row'] | null;
};

interface TestimonialsProps {
  profileId: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ profileId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<TestimonialWithAuthor[]>([]);
  const [pendingTestimonials, setPendingTestimonials] = useState<TestimonialWithAuthor[]>([]);
  const [newTestimonial, setNewTestimonial] = useState('');
    const [isLoading, setIsLoading] = useState(true);

  const isOwnProfile = user?.id === profileId;

  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);

    const fetchAndProcessTestimonials = async (status: 'approved' | 'pending') => {
      const { data: testimonialData, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('recipient_id', profileId)
        .eq('status', status);

      if (error) {
        console.error(`Error fetching ${status} testimonials:`, error);
        toast({ title: 'Error', description: `Could not fetch ${status} testimonials.`, variant: 'destructive' });
        return [];
      }

      if (!testimonialData || testimonialData.length === 0) {
        return [];
      }

      const authorIds = [...new Set(testimonialData.map(t => t.author_id))];
      const { data: authorData, error: authorError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', authorIds);

      if (authorError) {
        console.error('Error fetching authors:', authorError);
        toast({ title: 'Error', description: 'Could not fetch testimonial authors.', variant: 'destructive' });
        return testimonialData.map(t => ({ ...t, author: null }));
      }

      const authorsById = new Map(authorData.map(a => [a.id, a]));

      return testimonialData.map(t => ({
        ...t,
        author: authorsById.get(t.author_id) ?? null,
      }));
    };

    const approved = await fetchAndProcessTestimonials('approved');
    setTestimonials(approved);

    if (isOwnProfile) {
      const pending = await fetchAndProcessTestimonials('pending');
      setPendingTestimonials(pending);
    }

    setIsLoading(false);
  }, [profileId, isOwnProfile, toast]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

    const handleStatusUpdate = async (testimonialId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('testimonials')
      .update({ status })
      .eq('id', parseInt(testimonialId, 10));

    if (error) {
      toast({ title: 'Error', description: `Failed to ${status} testimonial.`, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Testimonial has been ${status}.` });
      fetchTestimonials();
    }
  };

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTestimonial.trim()) return;

    const { error } = await supabase.from('testimonials').insert({
      author_id: user.id,
      recipient_id: profileId,
      content: newTestimonial.trim(),
    });

    if (error) {
      toast({ title: 'Error', description: 'Failed to submit testimonial. You may have already submitted one.', variant: 'destructive' });
      console.error('Submit error:', error);
    } else {
      toast({ title: 'Success', description: 'Your testimonial has been submitted for approval.' });
      setNewTestimonial('');
    }
  };

    if (isLoading) {
    return <div>Loading testimonials...</div>;
  }

  return (
    <div className="space-y-8">
      {isOwnProfile && pendingTestimonials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Testimonials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTestimonials.map((testimonial) => (
              <div key={testimonial.id.toString()} className="p-4 border rounded-lg">
                <p className="italic">\"{testimonial.content}\"</p>
                <p className="text-sm text-muted-foreground">- {testimonial.author?.full_name || 'Anonymous'}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => handleStatusUpdate(testimonial.id.toString(), 'approved')}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(testimonial.id.toString(), 'rejected')}>Reject</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          {testimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id.toString()}
                  testimonial={{
                    id: testimonial.id.toString(),
                    quote: testimonial.content,
                    author: {
                      name: testimonial.author?.full_name || 'Anonymous',
                      avatar: testimonial.author?.avatar_url || '',
                      role: testimonial.author?.role || 'User'
                    },
                    project: {
                      title: 'Collaboration Project',
                      link: ''
                    },
                    rating: 5,
                    date: new Date(testimonial.created_at).toLocaleDateString()
                  }}
                  onProjectClick={(link) => console.log('Project clicked:', link)}
                />
              ))}
            </div>
          ) : (
            <p>No testimonials yet.</p>
          )}
        </CardContent>
      </Card>

      {!isOwnProfile && user && (
        <Card>
          <CardHeader>
            <CardTitle>Leave a Testimonial</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitTestimonial} className="space-y-4">
              <Textarea
                value={newTestimonial}
                onChange={(e) => setNewTestimonial(e.target.value)}
                placeholder="Share your experience working with this professional..."
                rows={4}
              />
              <Button type="submit">Submit for Approval</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Testimonials;
