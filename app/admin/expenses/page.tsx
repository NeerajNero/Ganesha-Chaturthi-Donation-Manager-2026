import { ExpenseForm } from "./_components/expense-form";
import { ExpenseList } from "./_components/expense-list";
import { SettingToggle } from "@/components/setting-toggle";

export default function AdminExpensesPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-xl font-bold">Expenses</h1>
      <SettingToggle
        settingKey="showWallExpenses"
        label="💸 “Where the money went” on the wall"
        onDescription="Expenses are visible to the public on /wall"
        offDescription="Expenses are hidden from the public wall"
      />
      <ExpenseForm />
      <ExpenseList />
    </main>
  );
}
