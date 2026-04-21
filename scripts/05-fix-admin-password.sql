-- Update password for existing admin user
-- Email: admin@kixindeyangongo.ao
-- Password: demo123
-- SHA256 hash: 6b86b273f403ebf3e5d99cc20d6b1baac0fa57a3b3a05ad27f69be1b54f2db85

UPDATE public.users 
SET 
  password = '6b86b273f403ebf3e5d99cc20d6b1baac0fa57a3b3a05ad27f69be1b54f2db85',
  updated_at = NOW()
WHERE id = 'admin-001';

-- Delete old admin with wrong email
DELETE FROM public.users WHERE id = 'admin-20260421020409';

-- Verify
SELECT id, email, role FROM public.users WHERE role = 'admin';
