create table
    relationships (
        id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        host_id uuid NOT NULL references system_profiles (id),
        guest_id uuid NOT NULL references system_profiles (id),
        rating integer,
        host_rating integer,
        guest_rating integer,
        paused timestamp,
        host_paused timestamp,
        guest_paused timestamp
    );