import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useState } from 'react';
import { Database } from '@/types/supabase';

type Gig = Database['public']['Tables']['gigs']['Row'];

const proposalFormSchema = z.object({
  message: z.string().min(10, { message: 'Your message must be at least 10 characters.' }),
  rate: z.coerce.number().positive({ message: 'Rate must be a positive number.' }),
});

type ProposalFormValues = z.infer<typeof proposalFormSchema>;

interface CreateProposalFormProps {
  gig: Gig;
  children: React.ReactNode;
  onProposalSubmitted: () => void;
}

export const CreateProposalForm: React.FC<CreateProposalFormProps> = ({ gig, children, onProposalSubmitted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (values: ProposalFormValues) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to submit a proposal.');
      return;
    }

    const { error } = await supabase.from('proposals').insert([
      {
        ...values,
        gig_id: gig.id,
        user_id: user.id,
        status: 'pending',
      },
    ]);

    if (error) {
      toast.error('Failed to submit proposal:', { description: error.message });
    } else {
      toast.success('Proposal submitted successfully!');
      onProposalSubmitted();
      setIsOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Proposal for: {gig.title}</DialogTitle>
          <DialogDescription>
            Explain why you're a great fit for this project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Introduce yourself and highlight your relevant skills..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Proposed Rate ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="btn-premium">Submit Proposal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
