-- Reset admin user with proper SHA256 hashed password
-- Password: demo123
-- SHA256 hash: 6b86b273f403ebf3e5d99cc20d6b1baac0fa57a3b3a05ad27f69be1b54f2db85

-- Delete existing admin users
DELETE FROM public.users WHERE email IN ('admin@kixinde.com', 'admin@example.com', 'admin-001');

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
  'admin-001',
  'admin@kixinde.com',
  'Admin Kixinde',
  '6b86b273f403ebf3e5d99cc20d6b1baac0fa57a3b3a05ad27f69be1b54f2db85',
  'admin',
  NOW(),
  NOW()
);

-- Verify insertion
SELECT id, email, name, role, created_at FROM public.users WHERE role = 'admin';
