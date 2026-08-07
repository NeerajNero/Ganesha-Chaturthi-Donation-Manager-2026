export const MILESTONES = [25, 50, 75, 100] as const;

// Highest milestone percentage crossed when the verified total moved from
// `before` to `after`, or null.
export function crossedMilestone(
  before: number,
  after: number,
  goal: number
): number | null {
  let crossed: number | null = null;
  for (const m of MILESTONES) {
    const threshold = (m / 100) * goal;
    if (before < threshold && after >= threshold) crossed = m;
  }
  return crossed;
}

export function milestoneMessage(
  percent: number,
  total: number,
  goal: number,
  appUrl: string
): string {
  const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const headline =
    percent >= 100
      ? "🎊 GOAL ACHIEVED! Ganpati Bappa Morya! 🎊"
      : `🎉 Milestone — ${percent}% of our goal!`;
  return [
    headline,
    `Collected ${rupees(total)} of ${rupees(goal)}.`,
    `Thank you to every donor and volunteer 🙏`,
    `${appUrl}/wall`,
  ].join("\n");
}

// For the public banner on / and /wall.
export function currentMilestone(progress: number): {
  percent: number;
  label: string;
} | null {
  if (progress >= 100)
    return { percent: 100, label: "Goal achieved! Ganpati Bappa Morya! 🎊" };
  if (progress >= 75) return { percent: 75, label: "Three-quarters of the way there!" };
  if (progress >= 50) return { percent: 50, label: "Halfway to our goal!" };
  if (progress >= 25) return { percent: 25, label: "A quarter of the way — great start!" };
  return null;
}
