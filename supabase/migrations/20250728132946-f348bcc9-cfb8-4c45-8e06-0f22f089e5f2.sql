
-- 1. Add comprehensive RLS policies for the reviews table
CREATE POLICY "Users can view reviews for their contracts" ON public.reviews
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.contracts 
    WHERE contracts.id = reviews.contract_id 
    AND (contracts.client_id = auth.uid() OR contracts.professional_id = auth.uid())
  )
);

CREATE POLICY "Users can create reviews for their contracts" ON public.reviews
FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND
  EXISTS (
    SELECT 1 FROM public.contracts 
    WHERE contracts.id = reviews.contract_id 
    AND (contracts.client_id = auth.uid() OR contracts.professional_id = auth.uid())
  )
);

CREATE POLICY "Users can update their own reviews" ON public.reviews
FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
FOR DELETE USING (auth.uid() = reviewer_id);

-- 2. Secure existing database functions by adding search_path protection
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_member_of_conversation(p_conversation_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.conversation_participants
    WHERE conversation_id = p_conversation_id AND user_id = p_user_id
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_party_to_contract(p_contract_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.contracts
    WHERE id = p_contract_id AND (client_id = p_user_id OR professional_id = p_user_id)
  );
END;
$function$;

-- 3. Prevent privilege escalation by removing role update capability for users
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

CREATE POLICY "Users can update their own profile (except role)" ON public.profiles
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Prevent users from updating their own role
  (OLD.role IS NOT DISTINCT FROM NEW.role OR auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ))
);

-- 4. Create admin-only role management function
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Only allow admins to update roles
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  UPDATE public.profiles 
  SET role = new_role, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN FOUND;
END;
$function$;

-- 5. Add file upload security policies
CREATE POLICY "Users can only upload files within size limits" ON public.media_uploads
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  file_size <= 100 * 1024 * 1024 -- 100MB limit
);

CREATE POLICY "Users can only upload allowed file types" ON public.media_uploads
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  mime_type IN (
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4',
    'video/mp4', 'video/webm', 'video/ogg',
    'application/pdf', 'text/plain'
  )
);
