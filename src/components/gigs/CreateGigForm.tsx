
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { validateInput, sanitizeText } from '@/utils/sanitization';
import { toast } from 'sonner';
import { useState } from 'react';

const gigFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }).max(100, { message: 'Title too long.' }),
  description: z.string().max(1000, { message: 'Description too long.' }).optional(),
  budget: z.coerce.number().positive({ message: 'Budget must be a positive number.' }).max(1000000, { message: 'Budget too high.' }).optional(),
  location: z.string().max(100, { message: 'Location too long.' }).optional(),
  type: z.enum(['studio_session', 'live_performance', 'songwriting', 'mixing_mastering', 'other']),
  skills_required: z.string().max(200, { message: 'Skills list too long.' }).optional(),
});

type GigFormValues = z.infer<typeof gigFormSchema>;

interface CreateGigFormProps {
  onGigCreated: () => void;
  children: React.ReactNode;
}

export const CreateGigForm: React.FC<CreateGigFormProps> = ({ onGigCreated, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<GigFormValues>({
    resolver: zodResolver(gigFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      skills_required: '',
    },
  });

  const onSubmit = async (values: GigFormValues) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to post a gig.');
      return;
    }

    // Validate and sanitize inputs
    if (!validateInput(values.title, 100)) {
      toast.error('Title contains invalid characters');
      return;
    }

    if (values.description && !validateInput(values.description, 1000)) {
      toast.error('Description contains invalid characters');
      return;
    }

    const sanitizedValues = {
      ...values,
      title: sanitizeText(values.title),
      description: values.description ? sanitizeText(values.description) : undefined,
      location: values.location ? sanitizeText(values.location) : undefined,
      skills_required: values.skills_required?.split(',').map(skill => sanitizeText(skill.trim())).filter(Boolean),
    };

    const { error } = await supabase.from('gigs').insert([
      {
        ...sanitizedValues,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error('Gig creation error:', error);
      toast.error('Failed to create gig. Please try again.');
    } else {
      toast.success('Gig created successfully!');
      onGigCreated();
      setIsOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a New Gig</DialogTitle>
          <DialogDescription>
            Fill out the details below to find the perfect collaborator for your project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gig Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Lead Vocalist for a Rock Ballad" 
                      {...field}
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the project, what you're looking for, and any important details." 
                      {...field}
                      maxLength={1000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gig Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gig type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="studio_session">Studio Session</SelectItem>
                        <SelectItem value="live_performance">Live Performance</SelectItem>
                        <SelectItem value="songwriting">Songwriting</SelectItem>
                        <SelectItem value="mixing_mastering">Mixing/Mastering</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 500" 
                        {...field}
                        min="1"
                        max="1000000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., New York, NY or Remote" 
                      {...field}
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skills_required"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills Required</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Pop, Vocals, Guitar (comma-separated)" 
                      {...field}
                      maxLength={200}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="btn-premium">Post Gig</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
