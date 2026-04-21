-- Update current admin user
-- New Email: admin@example.com
-- New Password: admin123
-- SHA256 hash of "admin123": 0192023a7bbd73250516f069df18b500

UPDATE public.users 
SET 
  email = 'admin@example.com',
  password = '0192023a7bbd73250516f069df18b500',
  name = 'Admin User',
  updated_at = NOW()
WHERE role = 'admin';

-- Verify update
SELECT id, email, name, role, password FROM public.users WHERE role = 'admin';
