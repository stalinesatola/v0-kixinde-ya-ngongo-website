-- Delete current admin and create new one
-- New Email: admin@example.com
-- New Password: admin123
-- SHA256 hash of "admin123": 0192023a7bbd73250516f069df18b500

BEGIN;

-- Delete all related records for admin-001
DELETE FROM public.user_subscriptions WHERE user_id = 'admin-001';
DELETE FROM public.ai_messages WHERE conversation_id IN (SELECT id FROM public.ai_conversations WHERE user_id = 'admin-001');
DELETE FROM public.ai_conversations WHERE user_id = 'admin-001';
DELETE FROM public.payment_transactions WHERE user_id = 'admin-001';
DELETE FROM public.payment_methods WHERE user_id = 'admin-001';
DELETE FROM public.project_logs WHERE user_id = 'admin-001';
DELETE FROM public.subscriptions WHERE user_id = 'admin-001';
DELETE FROM public.sessions WHERE user_id = 'admin-001';
DELETE FROM public.projects WHERE user_id = 'admin-001';

-- Delete the admin user
DELETE FROM public.users WHERE id = 'admin-001';

-- Insert new admin user
INSERT INTO public.users (
  id,
  email,
  name,
  password,
  role,
  created_at,
  updated_at
) VALUES (
  'admin-001',
  'admin@example.com',
  'Admin User',
  '0192023a7bbd73250516f069df18b500',
  'admin',
  NOW(),
  NOW()
);

COMMIT;

-- Verify insertion
SELECT id, email, name, role, created_at FROM public.users WHERE role = 'admin';
