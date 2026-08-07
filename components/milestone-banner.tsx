import { currentMilestone } from "@/lib/milestones";

export function MilestoneBanner({ progress }: { progress: number }) {
  const milestone = currentMilestone(progress);
  if (!milestone) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-marigold via-gold to-marigold px-4 py-3 text-center shadow">
      <p className="text-sm font-bold text-maroon">
        🎉 {milestone.label} <span className="font-extrabold">({milestone.percent}%)</span>
      </p>
    </div>
  );
}
