drop table availabilities;

-- Create the availabilities table
CREATE TABLE
    availabilities (
        user_id UUID NOT NULL REFERENCES system_profiles (id) ON DELETE CASCADE,
        hour_of_week INTEGER NOT NULL CHECK (
            hour_of_week >= 0
            AND hour_of_week <= 167
        ),
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            PRIMARY KEY (user_id, hour_of_week)
    );

-- Enable Row Level Security
ALTER TABLE availabilities ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own availabilities records
CREATE POLICY "Users can view own availabilities" ON availabilities FOR
SELECT
    USING (auth.uid () = user_id);

-- Policy: Users can only insert their own availabilities records
CREATE POLICY "Users can insert own availabilities" ON availabilities FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

-- Policy: Users can only delete their own availabilities records
CREATE POLICY "Users can delete own availabilities" ON availabilities FOR DELETE USING (auth.uid () = user_id);

-- Create index for better query performance
CREATE INDEX idx_availabilities_user_id ON availabilities (user_id);