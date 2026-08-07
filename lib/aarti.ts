import { DAILY_AARTI, FESTIVAL_END, FESTIVAL_START } from "@/lib/config";
import { addDaysIST } from "@/lib/dates";

export type NextAarti = { label: string; at: Date };

// Earliest future aarti within the festival window (all times IST), or null
// once the festival is over. Pure function — unit-testable.
export function nextAarti(now: Date): NextAarti | null {
  let day = FESTIVAL_START;
  for (let i = 0; i < 60 && day <= FESTIVAL_END; i++) {
    for (const aarti of DAILY_AARTI) {
      const at = new Date(`${day}T${aarti.time}:00+05:30`);
      if (at.getTime() > now.getTime()) return { label: aarti.label, at };
    }
    day = addDaysIST(day, 1);
  }
  return null;
}
