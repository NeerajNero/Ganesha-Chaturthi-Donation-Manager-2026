// Returns whether the message was actually delivered — donation notifications
// ignore the result (best-effort), the summary broadcast surfaces it.
export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  if (!token || !chatId) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    return res.ok;
  } catch {
    // Notifications are best-effort — never let them break a donation.
    return false;
  }
}

export function formatDonationMessage(input: {
  receiptNo: string;
  amount: number;
  mode: "CASH" | "UPI";
  status: "PENDING" | "VERIFIED" | "REJECTED";
  donorName: string;
  street: string;
  collectorName: string;
  totalSoFar: number;
}): string {
  const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const modeLabel =
    input.mode === "UPI" && input.status === "PENDING" ? "UPI (pending)" : input.mode;

  return [
    `🙏 New Donation — ${input.receiptNo}`,
    `${rupees(input.amount)} • ${modeLabel}`,
    `${input.donorName}, ${input.street}`,
    `Collected by: ${input.collectorName}`,
    `Total so far: ${rupees(input.totalSoFar)}`,
  ].join("\n");
}
