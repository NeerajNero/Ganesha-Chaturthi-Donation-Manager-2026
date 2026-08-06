import { CreateVolunteerForm } from "./_components/create-volunteer-form";
import { VolunteerList } from "./_components/volunteer-list";

export default function VolunteersPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-xl font-bold">Volunteers</h1>
      <CreateVolunteerForm />
      <VolunteerList />
    </main>
  );
}
