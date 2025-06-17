-- Clean up and create tables
create table
    timezones (
        zone_name text primary key,
        offset_hours integer not null
    );

-- Insert timezone data
insert into
    timezones (zone_name, offset_hours)
values
    ('UTC', 0),
    ('America/New_York', -5),
    ('America/Chicago', -6),
    ('America/Denver', -7),
    ('America/Los_Angeles', -8),
    ('America/Anchorage', -9),
    ('Pacific/Honolulu', -10),
    ('Europe/London', 0),
    ('Europe/Berlin', 1),
    ('Europe/Paris', 1),
    ('Europe/Rome', 1),
    ('Europe/Madrid', 1),
    ('Europe/Amsterdam', 1),
    ('Europe/Stockholm', 1),
    ('Europe/Moscow', 3),
    ('Asia/Tokyo', 9),
    ('Asia/Shanghai', 8),
    ('Asia/Hong_Kong', 8),
    ('Asia/Singapore', 8),
    ('Asia/Seoul', 9),
    ('Asia/Bangkok', 7),
    ('Asia/Mumbai', 5),
    ('Asia/Dubai', 4),
    ('Asia/Jerusalem', 2),
    ('Australia/Sydney', 10),
    ('Australia/Melbourne', 10),
    ('Australia/Perth', 8),
    ('Pacific/Auckland', 12),
    ('America/Sao_Paulo', -3),
    ('America/Argentina/Buenos_Aires', -3),
    ('America/Mexico_City', -6),
    ('America/Toronto', -5),
    ('America/Vancouver', -8),
    ('Africa/Cairo', 2),
    ('Africa/Johannesburg', 2),
    ('Africa/Lagos', 1);

ALTER TABLE timezones ENABLE ROW LEVEL SECURITY;

create policy "Everyone can read timezones timezones" on timezones for
select
    using (true);