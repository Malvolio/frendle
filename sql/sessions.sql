drop table sessions;
create table sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    host_id uuid references auth.users,
    guest_id uuid references auth.users,
    offer jsonb,
    answer jsonb,
    host_ice_candidates jsonb default '[]'::jsonb,
    guest_ice_candidates jsonb default '[]'::jsonb,
    status text default 'empty' check (status in ('waiting', 'active', 'empty'))
);

-- Add RLS policies
alter table sessions enable row level security;

-- Allow users to read sessions they're part of
create policy "Users can view their own sessions" on sessions
    for select using (auth.uid() = host_id or auth.uid() = guest_id);

-- Allow users to update sessions they're part of
create policy "Users can update their own sessions" on sessions
    for update using (auth.uid() = host_id or auth.uid() = guest_id);

-- Allow users to insert sessions as host
create policy "Users can create sessions as host" on sessions
    for insert with check (auth.uid() = host_id);

-- Add updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_sessions_updated_at
    before update on sessions
    for each row
    execute function update_updated_at_column();

insert into sessions (id, host_id, guest_id) values ('89825e4f-eaae-4e1a-9277-1af9d45df4d7', '268e870d-2a80-468e-a87e-854b6c428afa', '268e870d-2a80-468e-a87e-854b6c428afa');
insert into sessions (id, host_id, guest_id) values ('ffcc25ea-b2d5-4193-9648-4033659da678', '268e870d-2a80-468e-a87e-854b6c428afa', '9387010b-d213-4f2a-99c7-3b5a33189822');

update sessions
set
  offer = null,
  answer = null,
  host_ice_candidates = '[]',
  guest_ice_candidates = '[]',
  status = 'empty';