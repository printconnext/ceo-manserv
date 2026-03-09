-- 1. Ensure the bucket 'ceoprofile' exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('ceoprofile', 'ceoprofile', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public to UPLOAD files to the 'ceoprofile' bucket
-- This fixes the "new row violates row-level security policy" error
CREATE POLICY "Allow Public Upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'ceoprofile');

-- 3. Allow public to VIEW (SELECT) files in the 'ceoprofile' bucket
-- This ensures images show up on the website
CREATE POLICY "Allow Public View" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'ceoprofile');

-- 4. (Optional) Allow public to UPDATE/DELETE their own files if needed
-- For now, we focus on Upload and View.
