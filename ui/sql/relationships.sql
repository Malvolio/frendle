drop table relationships;

create table
    relationships (
        id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        host_id uuid NOT NULL references system_profiles (id),
        guest_id uuid NOT NULL references system_profiles (id),
        rating integer,
        host_rating integer,
        guest_rating integer,
        paused_until timestamp,
        host_paused_until timestamp,
        guest_paused_until timestamp,
        next_match timestamp
    );

ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;