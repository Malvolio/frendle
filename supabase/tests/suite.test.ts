// tests/suite.test.ts
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { TZDate } from "https://esm.sh/@date-fns/tz@1.2.0";
import { findOverlappingSlots, generateICSInvite } from "../shared/utils.ts";

// // Test utility functions
Deno.test("findOverlappingSlots - should find overlapping availability", () => {
  const hostAvailability = [120, 20, 30];
  const guestAvailability = [125, 20, 30];
  const overlaps = findOverlappingSlots(
    hostAvailability,
    guestAvailability,
    "America/New_York",
    "Europe/London",
    new Date("2025-12-25T12:00:00Z")
  );

  // Should find one overlap (Monday 10am)
  assertEquals(overlaps.length, 1);
  const ft = overlaps[0];
  assertEquals(new TZDate(ft, "America/New_York").getHours(), 0);
  assertEquals(new TZDate(ft, "America/New_York").getDay(), 5);
  assertEquals(new TZDate(ft, "Europe/London").getDay(), 5);
  assertEquals(new TZDate(ft, "Europe/London").getHours(), 5);
  assertEquals(
    ft.getTime(),
    new Date("2025-12-26T05:00:00.000+00:00").getTime()
  );
});

// // Test utility functions
Deno.test(
  "findOverlappingSlots - should not find overlapping availability",
  () => {
    const hostAvailability = [120, 20, 30];
    const guestAvailability = [125, 20, 30];

    const overlaps = findOverlappingSlots(
      hostAvailability,
      guestAvailability,
      "America/New_York",
      "Europe/London",
      new Date("2025-10-27T12:00:00Z")
    );

    // if (overlaps.length > 0) {
    //   const ft = overlaps[0];
    //   console.log("Overlapping slot found:", ft.toISOString());
    //   console.log(new TZDate(ft, "America/New_York").getHours());
    //   console.log(new TZDate(ft, "Europe/London").getHours());
    // }

    // no overlap, because DST has ended
    assertEquals(overlaps.length, 0);
  }
);

Deno.test("generateICSInvite - should create valid ICS format", () => {
  const sessionId = "test-session";
  const startTime = new Date("2024-12-25T15:00:00Z");
  const hostName = "Alice";
  const guestName = "Bob";

  const ics = generateICSInvite(
    sessionId,
    startTime,
    hostName,
    guestName,
    true
  );

  assertExists(ics);
  assertEquals(ics.includes("BEGIN:VCALENDAR"), true);
  assertEquals(ics.includes("BEGIN:VEVENT"), true);
  assertEquals(ics.includes("Frendle Session with Bob"), true);
  assertEquals(ics.includes("END:VEVENT"), true);
  assertEquals(ics.includes("END:VCALENDAR"), true);
});

// // Integration tests for edge functions
// Deno.test(
//   "matchCurrentUser - should handle user with no availability",
//   async () => {
//     // This would require mocking Supabase client
//     // In a real test environment, you'd set up test database fixtures
//     console.log(
//       "Integration test: matchCurrentUser with no availability - requires test DB setup"
//     );
//   }
// );

// // Test business logic
// Deno.test("Business logic - session limit enforcement", () => {
//   const maxSessions = 3;
//   const currentSessions = 2;
//   const canCreateMore = currentSessions < maxSessions;

//   assertEquals(canCreateMore, true);

//   const atLimit = 3;
//   const cannotCreateMore = atLimit < maxSessions;
//   assertEquals(cannotCreateMore, false);
// });

// Deno.test("Business logic - membership status validation", () => {
//   const validStatus = "good";
//   const invalidStatuses = ["unpaid", "suspended", "banned", "paused"];

//   assertEquals(validStatus === "good", true);

//   for (const status of invalidStatuses) {
//     assertEquals(status === "good", false);
//   }
// });

// Deno.test("Business logic - future session validation", () => {
//   const now = new Date();
//   const futureTime = new Date(now.getTime() + 25 * 60 * 60 * 1000); // 25 hours from now
//   const pastTime = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago

//   assertEquals(futureTime > now, true);
//   assertEquals(pastTime > now, false);

//   // Test minimum future time (24 hours)
//   const minFutureTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
//   assertEquals(futureTime > minFutureTime, true);
// });

// // Test timezone handling
// Deno.test("Timezone handling - hour of week conversion", () => {
//   const mondayMorning = 10; // Monday 10am = hour 10 of week
//   const expectedDay = Math.floor(mondayMorning / 24); // Should be 0 (Monday)
//   const expectedHour = mondayMorning % 24; // Should be 10

//   assertEquals(expectedDay, 0);
//   assertEquals(expectedHour, 10);
// });

// // Test relationship logic
// Deno.test("Relationship logic - rating calculation", () => {
//   const hostRating = 2;
//   const guestRating = 1;
//   const overallRating = hostRating * guestRating;

//   assertEquals(overallRating, 2);

//   // Test with null rating (should treat as 1)
//   const nullRating = null;
//   const ratingWithNull = hostRating * (nullRating ?? 1);
//   assertEquals(ratingWithNull, 2);
// });

// Deno.test("Relationship logic - pause date calculation", () => {
//   const userPause = new Date("2024-12-31");
//   const otherUserPause = new Date("2024-12-25");
//   const futureSessionDate = new Date("2024-12-30");

//   // Should use the maximum pause date
//   const maxPause = userPause > otherUserPause ? userPause : otherUserPause;
//   assertEquals(maxPause, userPause);

//   // Should extend past future sessions
//   const minPauseFromSessions = new Date(
//     futureSessionDate.getTime() + 24 * 60 * 60 * 1000
//   );
//   const finalPause =
//     maxPause > minPauseFromSessions ? maxPause : minPauseFromSessions;
//   assertEquals(finalPause, userPause); // userPause is later than minPauseFromSessions
// });

// // Performance tests
// Deno.test("Performance - availability overlap calculation", () => {
//   const largeAvailability = Array.from({ length: 168 }, (_, i) => i);
//   const smallAvailability = [10, 20, 30];

//   const startTime = performance.now();
//   const overlaps = largeAvailability.filter((hour) =>
//     smallAvailability.includes(hour)
//   );
//   const endTime = performance.now();

//   assertEquals(overlaps.length, 3);
//   assertEquals(endTime - startTime < 10, true); // Should complete in less than 10ms
// });

// Mock functions for testing (would be in separate file in real implementation)
// export const createMockSupabaseClient = () => ({
//   auth: {
//     getUser: () => Promise.resolve({ data: { user: mockUser }, error: null }),
//   },
//   from: (table: string) => ({
//     select: () => ({
//       eq: () => ({
//         single: () => Promise.resolve({ data: mockUser, error: null }),
//       }),
//     }),
//     insert: () => ({
//       select: () => ({
//         single: () => Promise.resolve({ data: mockSession, error: null }),
//       }),
//     }),
//     update: () => ({
//       eq: () => Promise.resolve({ error: null }),
//     }),
//   }),
// });

// // Integration test setup (would be in separate file)
// export const setupTestDatabase = async () => {
//   // This would set up test fixtures in a test database
//   console.log("Setting up test database fixtures...");
// };

// export const teardownTestDatabase = async () => {
//   // This would clean up test data
//   console.log("Cleaning up test database...");
// };

// // End-to-end test scenarios (would be in separate file)
// export const testCompleteMatchingFlow = async () => {
//   console.log("Testing complete matching flow...");
//   // 1. Create test users with availability
//   // 2. Call matchCurrentUser
//   // 3. Verify sessions created
//   // 4. Verify emails sent
//   // 5. Test confirmation flow
//   // 6. Test rating flow
//   // 7. Cleanup
// };
