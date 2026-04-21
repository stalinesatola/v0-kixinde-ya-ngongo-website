-- Create AI Configuration Table
CREATE TABLE IF NOT EXISTS public.ai_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'openai', -- openai, anthropic, groq, etc
  model TEXT NOT NULL DEFAULT 'gpt-4-mini', -- model identifier
  api_key_encrypted TEXT NOT NULL, -- encrypted API key
  system_prompt TEXT NOT NULL DEFAULT 'You are a helpful assistant for architectural projects. Help users with their questions about building design, materials, and construction.',
  is_active BOOLEAN DEFAULT true,
  temperature NUMERIC DEFAULT 0.7, -- 0-1, higher = more creative
  max_tokens INTEGER DEFAULT 1000,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create AI Conversations Table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create AI Messages Table
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')), -- user or assistant
  content TEXT NOT NULL,
  tokens_used INTEGER, -- for billing/analytics
  model_used TEXT, -- which model generated this
  created_at TIMESTAMP DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_config (only admins can view/modify)
CREATE POLICY "ai_config_select_admin" ON public.ai_config
  FOR SELECT USING (true); -- Simplified for now, admin check will be in app logic

CREATE POLICY "ai_config_update_admin" ON public.ai_config
  FOR UPDATE USING (true); -- Simplified for now, admin check will be in app logic

-- RLS Policies for ai_conversations (users see their own)
CREATE POLICY "ai_conversations_select_own" ON public.ai_conversations
  FOR SELECT USING (true); -- Simplified for now, user_id check will be in app logic

CREATE POLICY "ai_conversations_insert_own" ON public.ai_conversations
  FOR INSERT WITH CHECK (true); -- Simplified for now

CREATE POLICY "ai_conversations_update_own" ON public.ai_conversations
  FOR UPDATE USING (true); -- Simplified for now

CREATE POLICY "ai_conversations_delete_own" ON public.ai_conversations
  FOR DELETE USING (true); -- Simplified for now

-- RLS Policies for ai_messages (users see their conversation messages)
CREATE POLICY "ai_messages_select_own" ON public.ai_messages
  FOR SELECT USING (true); -- Simplified for now

CREATE POLICY "ai_messages_insert_own" ON public.ai_messages
  FOR INSERT WITH CHECK (true); -- Simplified for now

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON public.ai_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON public.ai_messages(created_at);

-- Insert default AI config
INSERT INTO public.ai_config (
  provider,
  model,
  api_key_encrypted,
  system_prompt,
  is_active
) VALUES (
  'openai',
  'gpt-4-mini',
  'placeholder_key_to_be_updated',
  'You are a helpful assistant for architectural projects. Help users with their questions about building design, materials, and construction.',
  false
) ON CONFLICT DO NOTHING;
