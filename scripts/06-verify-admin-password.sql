-- Verify what password hash is currently stored for admin
SELECT id, email, password FROM public.users WHERE role = 'admin';

-- The correct SHA256 hash of "demo123" is:
-- 6b86b273f403ebf3e5d99cc20d6b1baac0fa57a3b3a05ad27f69be1b54f2db85

-- Update admin password to correct SHA256 of "demo123"
UPDATE public.users 
SET password = '6b86b273f403ebf3e5d99cc20d6b1baac0fa57a3b3a05ad27f69be1b54f2db85'
WHERE role = 'admin' AND id = 'admin-001';

-- Verify update
SELECT id, email, password FROM public.users WHERE role = 'admin';
