
-- Create escrow_transactions table for gig management
CREATE TABLE public.escrow_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gig_id BIGINT NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'funded', 'released', 'disputed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  released_at TIMESTAMP WITH TIME ZONE,
  dispute_reason TEXT
);

-- Enable Row Level Security
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for escrow_transactions
CREATE POLICY "Users can view escrow for their gigs" ON public.escrow_transactions 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.gigs 
    WHERE gigs.id = escrow_transactions.gig_id 
    AND gigs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create escrow for their gigs" ON public.escrow_transactions 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.gigs 
    WHERE gigs.id = escrow_transactions.gig_id 
    AND gigs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update escrow for their gigs" ON public.escrow_transactions 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.gigs 
    WHERE gigs.id = escrow_transactions.gig_id 
    AND gigs.user_id = auth.uid()
  )
);

-- Add missing columns to gigs table to match the Gig interface
ALTER TABLE public.gigs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled'));
ALTER TABLE public.gigs ADD COLUMN IF NOT EXISTS escrow_status TEXT DEFAULT 'pending' CHECK (escrow_status IN ('pending', 'funded', 'released', 'disputed'));
ALTER TABLE public.gigs ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.gigs ADD COLUMN IF NOT EXISTS required_skills TEXT[] DEFAULT '{}';
ALTER TABLE public.gigs ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE public.gigs ADD COLUMN IF NOT EXISTS professional_id UUID;

-- Update the gigs table to use UUID for id (if not already)
-- Note: This is a complex migration, so we'll work with the existing bigint for now
