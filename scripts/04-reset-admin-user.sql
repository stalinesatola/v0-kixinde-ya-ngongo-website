-- Reset admin user with proper SHA256 hashed password
-- Password: demo123
-- SHA256 hash: 6b86b273f403ebf3e5d99cc20d6b1baac0fa57a3b3a05ad27f69be1b54f2db85

BEGIN;

-- Update existing admin user password and email
UPDATE public.users 
SET 
  password = '6b86b273f403ebf3e5d99cc20d6b1baac0fa57a3b3a05ad27f69be1b54f2db85',
  email = 'admin@kixindeyangongo.ao',
  name = 'Admin Kixinde Ya Ngongo',
  updated_at = NOW()
WHERE role = 'admin';

COMMIT;

-- Verify admin user
SELECT id, email, name, role, password FROM public.users WHERE role = 'admin';
