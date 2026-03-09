-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert files into assignments bucket
CREATE POLICY "assignments_insert" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'assignments' AND auth.role() = 'authenticated');

-- Allow authenticated users to update files in assignments bucket
CREATE POLICY "assignments_update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'assignments' AND auth.role() = 'authenticated');

-- Allow authenticated users to select/view files from assignments bucket
CREATE POLICY "assignments_select" ON storage.objects FOR SELECT 
USING (bucket_id = 'assignments' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete files from assignments bucket
CREATE POLICY "assignments_delete" ON storage.objects FOR DELETE 
