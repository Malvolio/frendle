-- Create the profiles table
CREATE TABLE
    profiles (
        id uuid NOT NULL references auth.users PRIMARY KEY,
        name text,
        bio text,
        avatar_url text,
        selected_charity text,
        created_at timestamp default now ()
    );

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read all profiles
CREATE POLICY "Anyone can read profiles" ON profiles FOR
SELECT
    USING (true);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE USING (auth.uid () = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT
WITH
    CHECK (auth.uid () = id);

insert into
    profiles (id, name)
values
    ('268e870d-2a80-468e-a87e-854b6c428afa', 'Michael'),
    ('9387010b-d213-4f2a-99c7-3b5a33189822', 'Venessa');