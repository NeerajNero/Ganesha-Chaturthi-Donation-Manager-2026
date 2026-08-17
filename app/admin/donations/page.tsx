import { DonationsManager } from "./_components/donations-manager";
import { SettingToggle } from "@/components/setting-toggle";

export default function AdminDonationsPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">Donations</h1>
      <SettingToggle
        settingKey="donationSectionVisible"
        label="🏠 Donation section on public home page"
        onDescription="Grand total, progress bar & recent donors are visible on the public home page"
        offDescription="Donation info is hidden from the public home page (volunteers can still collect)"
      />
      <DonationsManager />
    </main>
  );
}
