-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  company TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  currency TEXT NOT NULL,
  billing_period TEXT NOT NULL,
  projects_limit INTEGER NOT NULL,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create subscriptions table (legacy format)
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  projects_limit INTEGER NOT NULL,
  projects_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  projects_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  project_name TEXT NOT NULL,
  description TEXT,
  area NUMERIC,
  floors INTEGER,
  rooms INTEGER,
  bathrooms INTEGER,
  climate_zone TEXT,
  terrain_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  config JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  subscription_id TEXT REFERENCES subscriptions(id),
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create project_logs table
CREATE TABLE IF NOT EXISTS project_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  project_id TEXT REFERENCES projects(id),
  action TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert demo data
INSERT INTO users (id, email, password, name, role, company, phone) VALUES (
  'admin-001',
  'admin@kixindeyangongo.ao',
  '8d969eef6ecad3c29a3a873fba8fe02afeb2718b81d32fbfa9b5cec6de90763e',
  'Admin KIXINDE',
  'admin',
  'KIXINDE YA NGONGO',
  '+244 926 899 866'
);

INSERT INTO subscription_plans (id, name, description, price, currency, billing_period, projects_limit, features, is_active) VALUES (
  'plan-free',
  'Free',
  'Para experimentar',
  0,
  'AOA',
  'monthly',
  3,
  '["3 projectos por mês", "Suporte por email"]',
  true
), (
  'plan-pro',
  'Professional',
  'Para profissionais',
  9900,
  'AOA',
  'monthly',
  50,
  '["50 projectos por mês", "Suporte prioritário", "Exportar PDF"]',
  true
), (
  'plan-enterprise',
  'Enterprise',
  'Para empresas',
  29900,
  'AOA',
  'monthly',
  999,
  '["Projectos ilimitados", "Suporte 24/7", "API access", "Custom branding"]',
  true
);

INSERT INTO subscriptions (id, user_id, plan, status, projects_limit, projects_used) VALUES (
  'sub-001',
  'admin-001',
  'enterprise',
  'active',
  999,
  0
);

INSERT INTO user_subscriptions (id, user_id, plan_id, status, start_date, expires_at, auto_renew, projects_used) VALUES (
  'user-sub-001',
  'admin-001',
  'plan-enterprise',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year',
  true,
  0
);
