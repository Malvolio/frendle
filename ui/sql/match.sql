create or replace function get_matching_partners (arg_id UUID) RETURNS table (partner_id UUID, partner_timezone TEXT, name TEXT, email TEXT) LANGUAGE sql as $$
  SELECT DISTINCT
      partner.id "partner_id",
      partner_private_profile.timezone "partner_timezone",
      partner_public_profile.name "partner_name",
      partner_auth.email "email"
  FROM
      timezones "partner_timezone",
      timezones "my_timezone",
      availabilities "partner_availabilities",
      availabilities "my_availabilities",
      private_profiles "my_private_profile",
      private_profiles "partner_private_profile",
      public_profiles "partner_public_profile",
      auth.users "partner_auth",
      system_profiles "partner"
      LEFT JOIN relationships ON (
          (
              (
                  relationships.host_id = arg_id
                  AND relationships.guest_id = partner.id
              )
              OR (
                  relationships.host_id = partner.id
                  AND relationships.guest_id = arg_id
              )
          )
          AND relationships.paused_until > NOW ()
      )
      LEFT JOIN sessions ON (
          (
              (
                  sessions.host_id = arg_id
                  AND sessions.guest_id = partner.id
              )
              OR (
                  sessions.host_id = partner.id
                  AND sessions.guest_id = arg_id
              )
          )
          AND (session_status = 'scheduled' or session_status = 'rated')
          AND scheduled_for > CURRENT_TIMESTAMP - INTERVAL '1 day'
      )
  WHERE
      my_private_profile.id = arg_id
      AND my_availabilities.user_id = arg_id
      AND partner.id != arg_id
      AND my_timezone.zone_name = my_private_profile.timezone
      AND partner_private_profile.id = partner.id
      AND partner_public_profile.id = partner.id
      AND partner_auth.id = partner.id
      AND partner_availabilities.user_id = partner.id
      AND partner_timezone.zone_name = partner_private_profile.timezone
      AND partner_availabilities.hour_of_week - partner_timezone.offset_hours = my_availabilities.hour_of_week - my_timezone.offset_hours
      AND partner.membership_status = 'good'
      AND relationships.id IS NULL
      AND sessions.id IS NULL;
$$;