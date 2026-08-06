// India is UTC+5:30 (no DST) — all "day" logic in this app means IST days.

export function todayIST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

export function istDayRange(date: string): { gte: Date; lt: Date } {
  const gte = new Date(`${date}T00:00:00+05:30`);
  return { gte, lt: new Date(gte.getTime() + 24 * 60 * 60 * 1000) };
}
