export const GOAL_AMOUNT = 400_000; // rupees — public wall goal
export const COMMITTEE_NAME = "Ganesh Utsav 2026 - SKYSTARS";
export const YEAR_PREFIX = "GU26";

// Shown on the public homepage — edit to your real dates/venue.
export const FESTIVAL_DATES = "14 – 23 September 2026";
export const VENUE = "SKYSTARS Community Grounds";

// Pooja venue coordinates — enables the map + directions buttons on /live
// and the homepage. (https://maps.app.goo.gl/g9wFnjweJeQRREUr7)
export const VENUE_COORDS: { lat: number; lng: number } | null = {
  lat: 12.997374,
  lng: 77.684085,
};

// Festival window + daily aarti times (IST) — powers the /live countdown.
export const FESTIVAL_START = "TBA"; // YYYY-MM-DD
export const FESTIVAL_END = "TBA";
export const DAILY_AARTI = [
  { label: "Morning Aarti", time: "08:00" },
  { label: "Evening Aarti", time: "18:30" },
] as const;

// Donations at or above this amount get the gold Patron treatment on the wall.
export const PATRON_THRESHOLD = 5_000;

// Festival programme shown on /live — edit to your real schedule.
export const SCHEDULE = [
  { date: "14 Sep", day: "Monday", title: "Ganesh Sthapana & Pran Pratishtha", time: "10:00 AM" },
] as const;
