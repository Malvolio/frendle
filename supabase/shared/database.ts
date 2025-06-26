// shared/database.ts
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "./supabase.ts";
import { SessionStatus } from "./types.ts";
import { createSupabaseClient } from "./utils.ts";

export const executeInTransaction = async <T>(
  operation: (client: SupabaseClient<Database>) => Promise<T>
): Promise<T> => {
  const client = createSupabaseClient();

  // Note: Supabase doesn't have explicit transaction support in the client
  // In a production environment, you'd use database functions or handle this server-side
  try {
    return await operation(client);
  } catch (error) {
    // Log error and re-throw
    console.error("Transaction failed:", error);
    throw error;
  }
};

export const getUserSessions = (
  userId: string,
  status?: SessionStatus,
  timeFilter?: "future" | "past"
) => {
  const client = createSupabaseClient();

  const squery = client
    .from("sessions")
    .select(
      `
      *,
      host:system_profiles!host_id(id, name),
      guest:system_profiles!guest_id(id, name)
    `
    )
    .or(`host_id.eq.${userId},guest_id.eq.${userId}`);

  const fquery = status ? squery.eq("session_status", status) : squery;
  const query =
    timeFilter === "future"
      ? fquery.gte("scheduled_for", new Date().toISOString())
      : timeFilter === "past"
      ? fquery.lt("scheduled_for", new Date().toISOString())
      : fquery;

  return query.order("scheduled_for", { ascending: false });
};

export const getUserRelationships = (
  userId: string,
  activePausesOnly = false
) => {
  const client = createSupabaseClient();

  const query = client
    .from("relationships")
    .select("*")
    .or(`host_id.eq.${userId},guest_id.eq.${userId}`);

  if (activePausesOnly) {
    return query
      .not("paused", "is", null)
      .gte("paused", new Date().toISOString());
  }

  return query;
};

// shared/monitoring.ts
export const logPerformance = (
  operation: string,
  startTime: number,
  metadata?: unknown
) => {
  const duration = performance.now() - startTime;

  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      operation,
      duration_ms: Math.round(duration),
      metadata,
    })
  );

  // In production, you might send this to a monitoring service
  if (duration > 5000) {
    // Log slow operations (>5s)
    console.warn(`Slow operation detected: ${operation} took ${duration}ms`);
  }
};

export const logError = (
  operation: string,
  error: Error,
  metadata?: unknown
) => {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      operation,
      error: error.message,
      stack: error.stack,
      metadata,
    })
  );
};

// Database indexing suggestions (comments for DBA)
/*
Recommended database indexes for optimal performance:

1. system_profiles:
   CREATE INDEX idx_system_profiles_membership_status ON system_profiles(membership_status);
   CREATE INDEX idx_system_profiles_last_matched ON system_profiles(last_matched);

2. sessions:
   CREATE INDEX idx_sessions_host_guest ON sessions(host_id, guest_id);
   CREATE INDEX idx_sessions_scheduled_status ON sessions(scheduled_for, session_status);
   CREATE INDEX idx_sessions_participants ON sessions USING GIN (ARRAY[host_id, guest_id]);

3. availability:
   CREATE INDEX idx_availability_hour_overlap ON availability USING GIN (hour_of_week);
   CREATE INDEX idx_availability_user_hours ON availability(user_id, hour_of_week);

4. relationships:
   CREATE INDEX idx_relationships_participants ON relationships(host_id, guest_id);
   CREATE INDEX idx_relationships_paused ON relationships

   */
