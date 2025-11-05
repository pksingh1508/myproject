#### SQL Migration Script

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  college_name TEXT,
  phone TEXT,
  year_of_study TEXT,
  branch TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hackathons table
CREATE TABLE hackathons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  banner_url TEXT,
  location_type TEXT NOT NULL CHECK (location_type IN ('online', 'offline', 'hybrid')),
  location_details TEXT,
  venue_address TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  registration_start TIMESTAMPTZ NOT NULL,
  registration_end TIMESTAMPTZ NOT NULL,
  prize_pool INTEGER NOT NULL,
  first_prize INTEGER,
  second_prize INTEGER,
  third_prize INTEGER,
  participation_fee NUMERIC(10, 2) NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  min_team_size INTEGER DEFAULT 1,
  max_team_size INTEGER DEFAULT 4,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')),
  themes TEXT[],
  requirements TEXT,
  rules TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  team_name TEXT,
  team_members JSONB,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_id TEXT,
  submission_url TEXT,
  submission_description TEXT,
  submitted_at TIMESTAMPTZ,
  rank INTEGER,
  prize_won NUMERIC(10, 2),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, hackathon_id)
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  order_id TEXT UNIQUE NOT NULL,
  payment_id TEXT UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'initiated' CHECK (status IN ('initiated', 'pending', 'success', 'failed', 'refunded')),
  payment_method TEXT,
  payment_gateway TEXT DEFAULT 'Cashfree',
  gateway_response JSONB,
  refund_id TEXT,
  refund_amount NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsors table
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  tier TEXT CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hackathon Sponsors (many-to-many)
CREATE TABLE hackathon_sponsors (
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
  PRIMARY KEY (hackathon_id, sponsor_id)
);

-- Indexes for performance
CREATE INDEX idx_hackathons_status ON hackathons(status);
CREATE INDEX idx_hackathons_start_date ON hackathons(start_date);
CREATE INDEX idx_participants_user_id ON participants(user_id);
CREATE INDEX idx_participants_hackathon_id ON participants(hackathon_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hackathons_updated_at BEFORE UPDATE ON hackathons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment participant count
CREATE OR REPLACE FUNCTION increment_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'paid' THEN
    UPDATE hackathons
    SET current_participants = current_participants + 1
    WHERE id = NEW.hackathon_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_participants AFTER INSERT OR UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION increment_participant_count();
```

### 2.3 Row Level Security (RLS) Policies

```sql
-- Enable RLS
-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =============================
-- USERS POLICIES
-- =============================

-- Users can view their own data
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================
-- HACKATHONS POLICIES
-- =============================

-- Anyone can view published or ongoing hackathons
CREATE POLICY "Anyone can view published hackathons" ON hackathons
  FOR SELECT
  USING (status IN ('published', 'ongoing'));

-- Admins can manage hackathons (insert/update/delete)
CREATE POLICY "Admins can manage hackathons" ON hackathons
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM users
      WHERE users.user_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- =============================
-- PARTICIPANTS POLICIES
-- =============================

-- Users can view their own participations
CREATE POLICY "Users can view their own participations" ON participants
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE user_id = auth.uid()
    )
  );

-- Users can register (insert) for hackathons
CREATE POLICY "Users can register for hackathons" ON participants
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE user_id = auth.uid()
    )
  );

-- =============================
-- PAYMENTS POLICIES
-- =============================

-- Users can view their own payments
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE user_id = auth.uid()
    )
  );

-- =============================
-- NOTIFICATIONS POLICIES
-- =============================

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE user_id = auth.uid()
    )
  );

-- Users can update their own notifications
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM users WHERE user_id = auth.uid()
    )
  );

```
