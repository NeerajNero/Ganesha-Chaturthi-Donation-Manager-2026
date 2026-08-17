import { ReceiptSender } from "./_components/receipt-sender";

export default function AdminReceiptsPage() {
  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Send Receipts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search for a donor and share their receipt via WhatsApp. Donors
          without a mobile number get a copy-link button instead.
        </p>
      </div>
      <ReceiptSender />
    </main>
  );
}
