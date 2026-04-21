-- Fix admin password with the CORRECT hash
-- The hash d3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791 
-- corresponds to the actual password being used

UPDATE public.users 
SET 
  password = 'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791',
  updated_at = NOW()
WHERE id = 'admin-001';

-- Verify the update
SELECT id, email, password FROM public.users WHERE id = 'admin-001';
