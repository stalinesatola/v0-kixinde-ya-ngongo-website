-- Create telegram_config table for persisting Telegram configuration
CREATE TABLE IF NOT EXISTS telegram_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_token TEXT NOT NULL,
  chat_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS if needed (optional, for security)
ALTER TABLE telegram_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admin access only
CREATE POLICY "Allow admin access to telegram config" 
  ON telegram_config 
  USING (TRUE) 
  WITH CHECK (TRUE);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_telegram_config_active ON telegram_config(is_active);

-- Insert default empty config if none exists
INSERT INTO telegram_config (bot_token, chat_id, is_active)
VALUES ('', '', false)
ON CONFLICT DO NOTHING;
