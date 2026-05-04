-- Create Home Page Settings Table
CREATE TABLE IF NOT EXISTS public.home_page_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showFooter BOOLEAN DEFAULT true,
  showMenu BOOLEAN DEFAULT true,
  showHomeBody BOOLEAN DEFAULT true,
  customColorsEnabled BOOLEAN DEFAULT false,
  accentColor TEXT DEFAULT '#F7A71C',
  bodyBackground TEXT DEFAULT '#ffffff',
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);

ALTER TABLE public.home_page_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "home_page_settings_select" ON public.home_page_settings
  FOR SELECT USING (true);

CREATE POLICY "home_page_settings_update" ON public.home_page_settings
  FOR UPDATE USING (true);

CREATE POLICY "home_page_settings_insert" ON public.home_page_settings
  FOR INSERT WITH CHECK (true);

INSERT INTO public.home_page_settings (
  id,
  showFooter,
  showMenu,
  showHomeBody,
  customColorsEnabled,
  accentColor,
  bodyBackground
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  true,
  true,
  true,
  false,
  '#F7A71C',
  '#ffffff'
) ON CONFLICT (id) DO NOTHING;
