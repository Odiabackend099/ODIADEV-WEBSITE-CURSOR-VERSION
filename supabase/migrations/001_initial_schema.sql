-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    message TEXT,
    source TEXT DEFAULT 'website',
    session_id TEXT,
    qualified BOOLEAN DEFAULT FALSE,
    score NUMERIC,
    notes TEXT
);

-- Create client_intake table
CREATE TABLE client_intake (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    business_name TEXT NOT NULL,
    industry TEXT,
    country TEXT,
    preferred_channels TEXT[],
    whatsapp_number TEXT,
    telegram_handle TEXT,
    website_url TEXT,
    use_cases TEXT[],
    required_integrations TEXT[],
    budget_tier TEXT CHECK (budget_tier IN ('starter', 'business', 'enterprise')),
    timeline TEXT,
    voice_pref JSONB,
    contact JSONB,
    session_id TEXT
);

-- Create conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    ended_at TIMESTAMPTZ DEFAULT NOW(),
    final_reply TEXT,
    transcript TEXT,
    summary TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_qualified ON leads(qualified);
CREATE INDEX idx_leads_session_id ON leads(session_id);

CREATE INDEX idx_client_intake_business_name ON client_intake(business_name);
CREATE INDEX idx_client_intake_created_at ON client_intake(created_at);
CREATE INDEX idx_client_intake_session_id ON client_intake(session_id);

CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_conversations_ended_at ON conversations(ended_at);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access
CREATE POLICY "Service role can do everything" ON leads
    FOR ALL USING (true);

CREATE POLICY "Service role can do everything" ON client_intake
    FOR ALL USING (true);

CREATE POLICY "Service role can do everything" ON conversations
    FOR ALL USING (true);

-- Create policies for anon access (read-only for dashboard)
CREATE POLICY "Anon can read leads" ON leads
    FOR SELECT USING (true);

CREATE POLICY "Anon can read client_intake" ON client_intake
    FOR SELECT USING (true);

CREATE POLICY "Anon can read conversations" ON conversations
    FOR SELECT USING (true);
