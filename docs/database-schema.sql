-- ChannelMagic Database Schema
-- Für Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTH (ergänzt Supabase Auth)
-- =====================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  language TEXT DEFAULT 'de',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  wizard_step INTEGER DEFAULT 0,
  wizard_data JSONB DEFAULT '{}',  -- State Recovery für Wizard
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- API KEYS (verschlüsselt gespeichert)
-- =====================================================

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Keys werden server-side verschlüsselt
  openrouter_key_encrypted TEXT,
  heygen_key_encrypted TEXT,
  shopify_key_encrypted TEXT,

  -- Validierungsstatus
  openrouter_valid BOOLEAN DEFAULT FALSE,
  heygen_valid BOOLEAN DEFAULT FALSE,
  shopify_valid BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- =====================================================
-- CHANNELS
-- =====================================================

CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'tiktok')),
  platform_channel_id TEXT,

  -- OAuth Tokens (verschlüsselt)
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,

  niche TEXT,
  keywords TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'setup' CHECK (status IN ('setup', 'connected', 'disconnected')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_channels_user_id ON channels(user_id);

-- =====================================================
-- BRANDING
-- =====================================================

CREATE TABLE brandings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,

  -- URLs zu Supabase Storage
  logo_url TEXT,
  logo_square_url TEXT,
  banner_youtube_url TEXT,
  banner_tiktok_url TEXT,
  profile_image_url TEXT,

  -- Farben
  color_primary TEXT DEFAULT '#3B82F6',
  color_secondary TEXT DEFAULT '#1E40AF',
  color_accent TEXT DEFAULT '#F59E0B',

  -- Fonts
  font_heading TEXT DEFAULT 'Inter',
  font_body TEXT DEFAULT 'Inter',

  -- Ton
  tone TEXT DEFAULT 'casual' CHECK (tone IN ('professional', 'casual', 'humorous', 'educational')),
  tagline TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(channel_id)
);

-- =====================================================
-- AVATARS
-- =====================================================

CREATE TABLE avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('stock', 'custom')),

  -- HeyGen IDs
  heygen_avatar_id TEXT,
  heygen_voice_id TEXT,

  -- Für Custom Avatars
  source_video_url TEXT,
  processing_status TEXT DEFAULT 'ready' CHECK (processing_status IN ('uploading', 'processing', 'ready', 'failed')),

  -- Preview
  thumbnail_url TEXT,
  preview_video_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_avatars_user_id ON avatars(user_id);

-- =====================================================
-- CONTENT (Videos)
-- =====================================================

CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  avatar_id UUID REFERENCES avatars(id),

  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'video' CHECK (type IN ('video', 'short', 'reel')),

  -- Skript
  script_content TEXT,
  script_hook TEXT,
  script_cta TEXT,
  script_word_count INTEGER,
  script_estimated_duration INTEGER, -- Sekunden

  -- Video (HeyGen)
  heygen_video_id TEXT,
  video_url TEXT,
  video_status TEXT DEFAULT 'draft' CHECK (video_status IN (
    'draft',
    'script_ready',
    'generating',
    'video_ready',
    'failed'
  )),
  video_error_message TEXT,

  -- Thumbnail
  thumbnail_url TEXT,

  -- Compliance
  compliance_status TEXT DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'passed', 'warning', 'failed')),
  compliance_issues JSONB DEFAULT '[]',

  -- Kosten
  estimated_cost_usd DECIMAL(10,4),
  actual_cost_usd DECIMAL(10,4),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contents_channel_id ON contents(channel_id);
CREATE INDEX idx_contents_status ON contents(video_status);

-- =====================================================
-- CONTENT PIECES (Plattform-spezifisch)
-- =====================================================

CREATE TABLE content_pieces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,

  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'tiktok')),

  -- Plattform-spezifische Daten
  title TEXT NOT NULL,
  description TEXT,
  hashtags TEXT[] DEFAULT '{}',

  -- Video URL (kann anders sein als Original)
  video_url TEXT,
  thumbnail_url TEXT,

  -- Publishing
  platform_video_id TEXT,
  published_url TEXT,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,

  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft',
    'ready',
    'scheduled',
    'publishing',
    'published',
    'failed'
  )),
  publish_error TEXT,

  -- Analytics
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  last_analytics_sync TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_pieces_content_id ON content_pieces(content_id);
CREATE INDEX idx_content_pieces_platform ON content_pieces(platform);
CREATE INDEX idx_content_pieces_status ON content_pieces(status);

-- =====================================================
-- TEMPLATES
-- =====================================================

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('script', 'thumbnail', 'description', 'cta')),

  -- Template Content
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}', -- z.B. ['{{THEMA}}', '{{PRODUKT}}']

  -- Metadaten
  niche TEXT,
  is_default BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_type ON templates(type);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  push_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT TRUE,
  email_address TEXT,

  notify_video_complete BOOLEAN DEFAULT TRUE,
  notify_video_failed BOOLEAN DEFAULT TRUE,
  notify_budget_warning BOOLEAN DEFAULT TRUE,
  notify_new_lead BOOLEAN DEFAULT FALSE,
  notify_sponsor_response BOOLEAN DEFAULT FALSE,

  -- Web Push Subscription
  push_subscription JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',

  read BOOLEAN DEFAULT FALSE,
  sent_push BOOLEAN DEFAULT FALSE,
  sent_email BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- =====================================================
-- COST TRACKING
-- =====================================================

CREATE TABLE cost_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  service TEXT NOT NULL CHECK (service IN ('openrouter', 'heygen', 'dalle', 'other')),
  operation TEXT NOT NULL,
  cost_usd DECIMAL(10,6) NOT NULL,

  -- Referenz zum Content
  content_id UUID REFERENCES contents(id),

  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cost_logs_user_id ON cost_logs(user_id);
CREATE INDEX idx_cost_logs_created_at ON cost_logs(created_at);

-- View für monatliche Kosten
CREATE VIEW monthly_costs AS
SELECT
  user_id,
  DATE_TRUNC('month', created_at) AS month,
  service,
  SUM(cost_usd) AS total_cost
FROM cost_logs
GROUP BY user_id, DATE_TRUNC('month', created_at), service;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE brandings ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_logs ENABLE ROW LEVEL SECURITY;

-- Policies: User can only access their own data
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own api_keys" ON api_keys FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own channels" ON channels FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own avatars" ON avatars FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own templates" ON templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notification_settings" ON notification_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cost_logs" ON cost_logs FOR ALL USING (auth.uid() = user_id);

-- Brandings: Access through channel ownership
CREATE POLICY "Users can manage brandings through channels" ON brandings FOR ALL
  USING (EXISTS (SELECT 1 FROM channels WHERE channels.id = brandings.channel_id AND channels.user_id = auth.uid()));

-- Contents: Access through channel ownership
CREATE POLICY "Users can manage contents through channels" ON contents FOR ALL
  USING (EXISTS (SELECT 1 FROM channels WHERE channels.id = contents.channel_id AND channels.user_id = auth.uid()));

-- Content Pieces: Access through content ownership
CREATE POLICY "Users can manage content_pieces through contents" ON content_pieces FOR ALL
  USING (EXISTS (
    SELECT 1 FROM contents
    JOIN channels ON channels.id = contents.channel_id
    WHERE contents.id = content_pieces.content_id AND channels.user_id = auth.uid()
  ));

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brandings_updated_at BEFORE UPDATE ON brandings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_avatars_updated_at BEFORE UPDATE ON avatars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_pieces_updated_at BEFORE UPDATE ON content_pieces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  INSERT INTO notification_settings (user_id, email_address)
  VALUES (NEW.id, NEW.email);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- STORAGE BUCKETS (via Supabase Dashboard)
-- =====================================================

-- Diese müssen über das Supabase Dashboard erstellt werden:
-- 1. avatars - für Avatar-Upload Videos
-- 2. videos - für generierte Videos
-- 3. thumbnails - für Thumbnails
-- 4. assets - für Logo, Banner, etc.
