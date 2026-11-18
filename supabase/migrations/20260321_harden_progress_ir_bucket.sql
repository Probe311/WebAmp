-- Lock SECURITY DEFINER progress RPC to caller
CREATE OR REPLACE FUNCTION public.get_course_progress(user_uuid uuid, course_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> user_uuid THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  SELECT COUNT(*) INTO total_lessons FROM public.lessons WHERE course_id = course_uuid;
  SELECT COUNT(*) INTO completed_lessons FROM public.user_progress
    WHERE user_id = user_uuid AND course_id = course_uuid AND is_completed = true;
  IF total_lessons = 0 THEN RETURN 0; END IF;
  RETURN (completed_lessons * 100) / total_lessons;
END;
$$;

REVOKE ALL ON FUNCTION public.get_course_progress(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_course_progress(uuid, uuid) TO authenticated;

-- IR bucket: 50MB + audio mime allowlist
UPDATE storage.buckets
SET file_size_limit = 52428800,
    allowed_mime_types = ARRAY['audio/wav', 'audio/x-wav', 'audio/wave', 'audio/ogg', 'application/ogg']
WHERE id = 'ir';
