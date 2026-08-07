"use client";

import { useSettings, useUpdateSettings, type Settings } from "@/lib/api/settings";
import { Skeleton } from "@/components/skeleton";

export function SettingToggle({
  settingKey,
  label,
  onDescription,
  offDescription,
}: {
  settingKey: keyof Settings;
  label: string;
  onDescription: string;
  offDescription: string;
}) {
  const settings = useSettings();
  const update = useUpdateSettings();

  if (settings.isPending) return <Skeleton className="h-16" />;
  if (settings.isError) return null;

  const on = settings.data[settingKey];

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-gray-500">
          {on ? onDescription : offDescription}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        disabled={update.isPending}
        onClick={() => update.mutate({ [settingKey]: !on })}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
          on ? "bg-maroon" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
            on ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
