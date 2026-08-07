export const GOAL_AMOUNT = 400_000; // rupees — public wall goal
export const COMMITTEE_NAME = "Ganesh Utsav 2026 - SKYSTARS";
export const YEAR_PREFIX = "GU26";

// Shown on the public homepage — edit to your real dates/venue.
export const FESTIVAL_DATES = "14 – 23 September 2026";
export const VENUE = "SKYSTARS Community Grounds";

// Pooja venue coordinates — set to enable the map + directions buttons
// on /live and the homepage. Example: { lat: 12.9716, lng: 77.5946 }
export const VENUE_COORDS: { lat: number; lng: number } | null = null;

// Festival programme shown on /live — edit to your real schedule.
export const SCHEDULE = [
  { date: "14 Sep", day: "Monday", title: "Ganesh Sthapana & Pran Pratishtha", time: "10:00 AM" },
] as const;
