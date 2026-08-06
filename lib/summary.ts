// Pure formatter shared by the broadcast API (what actually gets sent) and
// the admin UI (the preview dialog) — so the preview is exactly the message.

export type SummaryInput = {
  collected: number;
  donationCount: number;
  spent: number;
  balance: number;
  pendingUpi: number;
  appUrl: string;
};

export function formatSummaryMessage(i: SummaryInput): string {
  const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  return [
    "📊 GU 2026 — Collection Summary",
    `🙏 Collected: ${rupees(i.collected)} (${i.donationCount} donations)`,
    `💸 Spent: ${rupees(i.spent)}`,
    `💰 Balance: ${rupees(i.balance)}`,
    `⏳ Pending UPI: ${rupees(i.pendingUpi)}`,
    `${i.appUrl}/wall`,
  ].join("\n");
}
