CREATE TYPE membership_status_enum AS ENUM ('unpaid', 'good', 'suspended', 'banned', 'paused');

-- Create main tables with corrected syntax
CREATE TABLE
    system_profiles (
        id uuid NOT NULL REFERENCES auth.users PRIMARY KEY,
        name text,
        membership_status membership_status_enum,
        last_matched timestamp,
        created_at timestamp DEFAULT now ()
    );

CREATE TABLE
    private_profiles (
        id uuid NOT NULL REFERENCES system_profiles PRIMARY KEY,
        timezone text REFERENCES timezones (zone_name),
        interests JSONB DEFAULT '{}' NOT NULL,
        created_at timestamp DEFAULT now ()
    );

CREATE TABLE
    public_profiles (
        id uuid NOT NULL REFERENCES system_profiles PRIMARY KEY,
        name text,
        bio text,
        avatar_url text,
        selected_charity text,
        created_at timestamp DEFAULT now ()
    );

-- Enable Row Level Security
ALTER TABLE system_profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE private_profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for system_profiles
-- Users can read their own profile
CREATE POLICY "Users can read their own system profile" ON system_profiles FOR
SELECT
    USING (auth.uid () = id);

-- RLS Policies for private_profiles  
-- Users can read their own private profile
CREATE POLICY "Users can read their own private profile" ON private_profiles FOR
SELECT
    USING (auth.uid () = id);

-- Users can update their own private profile
CREATE POLICY "Users can update their own private profile" ON private_profiles FOR
UPDATE USING (auth.uid () = id);

-- RLS Policies for public_profiles
-- Everyone can read all public profiles
CREATE POLICY "Everyone can read public profiles" ON public_profiles FOR
SELECT
    USING (true);

-- Users can update their own public profile
CREATE POLICY "Users can update their own public profile" ON public_profiles FOR
UPDATE USING (auth.uid () = id);