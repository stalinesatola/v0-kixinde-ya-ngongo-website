-- Check existing users
SELECT id, email, role FROM public.users WHERE role = 'admin' OR email LIKE '%admin%';
