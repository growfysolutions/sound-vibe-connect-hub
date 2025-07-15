-- Add missing software column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS software_proficiencies TEXT[];