-- Reset admin user with proper SHA256 hashed password
-- Password: demo123
-- SHA256 hash: 6b86b273f403ebf3e5d99cc20d6b1baac0fa57a3b3a05ad27f69be1b54f2db85

-- Delete any existing admin with this email to avoid conflicts
DELETE FROM public.users WHERE email = 'admin@kixinde.com';

-- Insert new admin user with hashed password
INSERT INTO public.users (
  id,
  email,
  name,
  password,
  role,
  created_at,
  updated_at
) VALUES (
  'admin-' || TO_CHAR(NOW(), 'YYYYMMDDHHmmss'),
  'admin@kixinde.com',
  'Admin Kixinde',
  '6b86b273f403ebf3e5d99cc20d6b1baac0fa57a3b3a05ad27f69be1b54f2db85',
  'admin',
  NOW(),
  NOW()
);

-- Verify insertion
SELECT id, email, name, role, created_at FROM public.users WHERE role = 'admin' ORDER BY created_at DESC LIMIT 1;
