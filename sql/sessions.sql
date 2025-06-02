-- 1. Create the table
create table
    sessions (
        id uuid primary key,
        created_at timestamptz default now (),
        host_id uuid references auth.users,
        guest_id uuid references auth.users,
        offer jsonb,
        answer jsonb,
        ice_candidates jsonb default '[]'::jsonb
    );

-- 2. Enable RLS
alter table sessions enable row level security;

-- 3. Allow host to insert a session
create policy "Host can insert session" on sessions for insert
with
    check (auth.uid () = host_id);

-- 4. Allow host or guest to read the session
create policy "Participants can read session" on sessions for
select
    using (
        auth.uid () = host_id
        or auth.uid () = guest_id
    );

-- 5. Allow host to update offer
create policy "Host can update offer" on sessions for
update using (auth.uid () = host_id)
with
    check (auth.uid () = host_id);

-- 6. Allow guest to update answer
create policy "Guest can update answer" on sessions for
update using (auth.uid () = guest_id)
with
    check (auth.uid () = guest_id);

-- 7. Optional: allow both to update ice_candidates
create policy "Participants can update ICE" on sessions for
update using (
    auth.uid () = host_id
    or auth.uid () = guest_id
)
with
    check (
        auth.uid () = host_id
        or auth.uid () = guest_id
    );