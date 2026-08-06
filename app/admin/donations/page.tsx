import { DonationsManager } from "./_components/donations-manager";

export default function AdminDonationsPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">Donations</h1>
      <DonationsManager />
    </main>
  );
}
