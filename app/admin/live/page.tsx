import { UpdatesManager } from "./_components/updates-manager";
import { SettingToggle } from "@/components/setting-toggle";

export default function AdminLivePage() {
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">Live page updates</h1>
      <p className="text-sm text-gray-600">
        Posts appear instantly on the public <span className="font-mono">/live</span> page.
        Edit the festival programme itself in <span className="font-mono">lib/config.ts</span>.
      </p>
      <SettingToggle
        settingKey="showAartiCountdown"
        label="⏳ Aarti countdown"
        onDescription="Visible on the public /live page"
        offDescription="Hidden from the public /live page"
      />
      <UpdatesManager />
    </main>
  );
}
