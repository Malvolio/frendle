drop table sessions;

CREATE TYPE session_status_enum AS ENUM (
    'scheduled',
    'cancelled_by_host',
    'cancelled_by_guest',
    'rated'
);

create table
    sessions (
        id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        room_id UUID NOT NULL DEFAULT gen_random_uuid (),
        created_at timestamp default now (),
        scheduled_for timestamp NOT NULL default now (),
        host_id uuid NOT NULL references system_profiles,
        guest_id uuid NOT NULL references system_profiles,
        host_confirmed timestamp,
        guest_confirmed timestamp,
        session_status session_status_enum NOT NULL DEFAULT 'scheduled'
    );

-- Add RLS policies
alter table sessions enable row level security;

-- Allow users to read sessions they're part of
create policy "Users can view their own sessions" on sessions for
select
    using (
        auth.uid () = host_id
        or auth.uid () = guest_id
    );

insert into
    sessions (id, host_id, guest_id)
values
    (
        '89825e4f-eaae-4e1a-9277-1af9d45df4d7',
        '268e870d-2a80-468e-a87e-854b6c428afa',
        '268e870d-2a80-468e-a87e-854b6c428afa'
    ),
    (
        'ffcc25ea-b2d5-4193-9648-4033659da678',
        '268e870d-2a80-468e-a87e-854b6c428afa',
        '9387010b-d213-4f2a-99c7-3b5a33189822'
    ),
    (
        '2c56983e-2b91-49db-94a9-e467524cf4e1',
        '9387010b-d213-4f2a-99c7-3b5a33189822',
        '9387010b-d213-4f2a-99c7-3b5a33189822'
    );