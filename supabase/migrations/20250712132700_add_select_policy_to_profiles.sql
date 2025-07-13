CREATE POLICY "Allow authenticated users to read profiles" ON public.profiles
FOR SELECT TO authenticated
USING (true);
