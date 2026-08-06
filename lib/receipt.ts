import type { Prisma } from "@prisma/client";
import { YEAR_PREFIX } from "@/lib/config";

// Must run inside prisma.$transaction — the row lock on Counter serializes
// concurrent increments, and a rollback rolls the counter back (no gaps).
export async function nextReceiptNo(
  tx: Prisma.TransactionClient
): Promise<string> {
  const counter = await tx.counter.upsert({
    where: { id: "receipt" },
    update: { value: { increment: 1 } },
    create: { id: "receipt", value: 1 },
  });
  return `${YEAR_PREFIX}-${String(counter.value).padStart(4, "0")}`;
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function belowHundred(n: number): string {
  if (n < 20) return ONES[n];
  const ten = TENS[Math.floor(n / 10)];
  const one = ONES[n % 10];
  return one ? `${ten} ${one}` : ten;
}

// Indian numbering: lakh (1,00,000) / thousand / hundred. Covers 0–99,99,999.
export function amountInWords(amount: number): string {
  let n = Math.floor(Math.abs(amount));
  if (n === 0) return "Zero Rupees";

  const parts: string[] = [];
  const lakh = Math.floor(n / 100_000);
  n %= 100_000;
  const thousand = Math.floor(n / 1_000);
  n %= 1_000;
  const hundred = Math.floor(n / 100);
  n %= 100;

  if (lakh) parts.push(`${belowHundred(lakh)} Lakh`);
  if (thousand) parts.push(`${belowHundred(thousand)} Thousand`);
  if (hundred) parts.push(`${ONES[hundred]} Hundred`);
  if (n) parts.push(belowHundred(n));

  return `${parts.join(" ")} Rupees Only`;
}
