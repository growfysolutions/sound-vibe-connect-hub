import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const proposalSchema = z.object({
  message: z.string().min(10, 'Proposal message must be at least 10 characters.'),
  rate: z.coerce.number().positive('Rate must be a positive number.').optional(),
  timeline: z.string().optional(),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

const SubmitProposal = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const navigate = useNavigate();
  const [gigTitle, setGigTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    const fetchGigTitle = async () => {
      if (!gigId) return;
      const numericGigId = parseInt(gigId, 10);
      if (isNaN(numericGigId)) {
        toast.error('Invalid Gig ID');
        navigate('/marketplace');
        return;
      }
      const { data, error } = await supabase
        .from('gigs')
        .select('title')
        .eq('id', numericGigId)
        .single();
      if (error) {
        toast.error('Failed to load gig details.');
        navigate('/marketplace');
      } else {
        setGigTitle(data.title);
      }
    };
    fetchGigTitle();
  }, [gigId, navigate]);

  const onSubmit = async (values: ProposalFormValues) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !gigId) {
      toast.error('You must be logged in to submit a proposal.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('proposals').insert({
      gig_id: parseInt(gigId, 10),
      user_id: user.id,
      message: values.message,
      rate: values.rate,
      timeline: values.timeline,
      status: 'pending',
    });

    setLoading(false);

    if (error) {
      console.error('Error submitting proposal:', error);
      toast.error(error.message || 'Failed to submit proposal.');
    } else {
      toast.success('Your proposal has been submitted successfully!');
      navigate(`/gigs/${gigId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Submit a Proposal</CardTitle>
          <CardDescription>For the gig: <span className="font-semibold text-primary">{gigTitle}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Proposal</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why you're the best fit for this gig..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Rate ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Timeline</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 weeks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Submitting...' : 'Submit Proposal'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitProposal;
