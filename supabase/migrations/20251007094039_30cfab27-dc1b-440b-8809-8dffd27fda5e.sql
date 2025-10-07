-- Test the existing RLS policy and ensure it's working correctly
-- First, let's verify the current policy is restrictive enough

-- Check current policy details
SELECT 
    schemaname,
    tablename, 
    policyname,
    permissive,
    cmd,
    qual as using_expression
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'clients';

-- Ensure RLS is enabled
SELECT tablename, rowsecurity as rls_enabled 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'clients';

-- Add a more explicit policy to be extra secure
-- Drop the existing policy and recreate it more explicitly
DROP POLICY IF EXISTS "Users can manage own clients" ON public.clients;

-- Create separate policies for better security control
CREATE POLICY "Users can view own clients" 
ON public.clients 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" 
ON public.clients 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" 
ON public.clients 
FOR DELETE 
USING (auth.uid() = user_id);