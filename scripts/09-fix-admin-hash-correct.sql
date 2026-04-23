-- Fix admin password hash to SHA256 of "admin123"
-- Correct SHA256 hash: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

UPDATE public.users
SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
WHERE id = 'admin-001';

-- Verify
SELECT id, email, password FROM public.users WHERE id = 'admin-001';
