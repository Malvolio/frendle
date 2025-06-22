-- Create the availability table
CREATE TABLE
    availability (
        user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
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
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own availability records
CREATE POLICY "Users can view own availability" ON availability FOR
SELECT
    USING (auth.uid () = user_id);

-- Policy: Users can only insert their own availability records
CREATE POLICY "Users can insert own availability" ON availability FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

-- Policy: Users can only delete their own availability records
CREATE POLICY "Users can delete own availability" ON availability FOR DELETE USING (auth.uid () = user_id);

-- Create index for better query performance
CREATE INDEX idx_availability_user_id ON availability (user_id);