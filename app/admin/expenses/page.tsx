import { ExpenseForm } from "./_components/expense-form";
import { ExpenseList } from "./_components/expense-list";

export default function AdminExpensesPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-xl font-bold">Expenses</h1>
      <ExpenseForm />
      <ExpenseList />
    </main>
  );
}
