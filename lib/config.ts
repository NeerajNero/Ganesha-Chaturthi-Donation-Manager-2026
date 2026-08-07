export const GOAL_AMOUNT = 400_000; // rupees — public wall goal
export const COMMITTEE_NAME = "Ganesh Utsav 2026 - SKYSTARS";
export const YEAR_PREFIX = "GU26";

// Shown on the public homepage — edit to your real dates/venue.
export const FESTIVAL_DATES = "14 – 23 September 2026";
export const VENUE = "SKYSTARS Community Grounds";

// Festival programme shown on /live — edit to your real schedule.
export const SCHEDULE = [
  { date: "14 Sep", day: "Monday", title: "Ganesh Sthapana & Pran Pratishtha", time: "10:00 AM" },
  { date: "14–22 Sep", day: "Daily", title: "Morning & Evening Aarti", time: "8:00 AM & 7:30 PM" },
  { date: "18 Sep", day: "Friday", title: "Cultural Evening — kids' performances", time: "6:30 PM" },
  { date: "21 Sep", day: "Sunday", title: "Maha Prasad / Bhandara", time: "12:00 PM" },
  { date: "23 Sep", day: "Wednesday", title: "Visarjan Yatra", time: "4:00 PM" },
] as const;
