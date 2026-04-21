-- Delete current admin and create new one
-- New Email: admin@example.com
-- New Password: admin123
-- SHA256 hash of "admin123": 0192023a7bbd73250516f069df18b500

BEGIN;

-- Delete existing admin user
DELETE FROM public.users WHERE role = 'admin';

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
