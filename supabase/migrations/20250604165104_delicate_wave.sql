/*
  # Add ICE candidates support
  
  1. Changes
    - Add ice_candidates column to sessions table
    - Update RLS policies to allow ICE candidate updates
  
  2. Security
    - Ensure only participants can update their own ICE candidates
*/

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ice_candidates jsonb DEFAULT '[]'::jsonb;

-- Allow participants to update ice_candidates
CREATE POLICY "Participants can update ICE candidates" ON sessions
FOR UPDATE USING (
  auth.uid() = host_id OR auth.uid() = guest_id
)
WITH CHECK (
  auth.uid() = host_id OR auth.uid() = guest_id
);