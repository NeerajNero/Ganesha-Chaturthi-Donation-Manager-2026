"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  useCreateDonation,
  useStreets,
  type Donation,
} from "@/lib/api/donations";
import { COMMITTEE_NAME } from "@/lib/config";
import { ScreenshotUpload } from "@/components/screenshot-upload";

const QUICK_AMOUNTS = [101, 201, 501, 1001] as const;
const INPUT_CLASS =
  "block h-13 w-full rounded-xl border border-gray-300 px-4 text-lg focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500";
const LABEL_CLASS = "mb-1 block text-sm font-medium text-gray-700";

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID;
const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME;

function whatsAppUrl(donation: Donation): string {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const message =
    `🙏 Thank you ${donation.donorName} for your donation of ` +
    `₹${donation.amount.toLocaleString("en-IN")} to ${COMMITTEE_NAME}. ` +
    `Your receipt: ${appUrl}/r/${donation.receiptNo}`;
  return `https://wa.me/91${donation.mobile}?text=${encodeURIComponent(message)}`;
}

export function DonationForm() {
  const [donorName, setDonorName] = useState("");
  const [street, setStreet] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"CASH" | "UPI">("CASH");
  const [mobile, setMobile] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState<Donation | null>(null);

  const streets = useStreets();
  const create = useCreateDonation();

  const amountNum = parseInt(amount, 10);
  const amountValid = Number.isInteger(amountNum) && amountNum >= 1 && amountNum <= 100_000;
  const mobileValid = mobile === "" || /^[6-9]\d{9}$/.test(mobile);

  function resetForNext() {
    // Keep street — volunteers work house to house on the same street.
    setDonorName("");
    setHouseNo("");
    setAmount("");
    setMode("CASH");
    setMobile("");
    setAnonymous(false);
    setScreenshotUrl(null);
    setSaved(null);
    create.reset();
  }

  if (saved) {
    return (
      <section className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <p className="text-4xl">✅</p>
        <h2 className="mt-2 text-xl font-bold text-green-700">Donation saved!</h2>
        <p className="mt-1 text-2xl font-bold">
          ₹{saved.amount.toLocaleString("en-IN")}
        </p>
        <p className="font-mono text-sm text-gray-600">{saved.receiptNo}</p>
        <p className="mt-1 text-sm text-gray-500">
          {saved.donorName} · {saved.mode}
          {saved.status === "PENDING" ? " (pending verification)" : ""}
        </p>

        <div className="mt-5 space-y-3">
          {saved.mobile && (
            <a
              href={whatsAppUrl(saved)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-13 w-full items-center justify-center rounded-xl bg-green-600 text-base font-semibold text-white active:bg-green-700"
            >
              💬 Send receipt on WhatsApp
            </a>
          )}
          <button
            type="button"
            onClick={resetForNext}
            className="h-13 w-full rounded-xl bg-orange-600 text-base font-semibold text-white active:bg-orange-700"
          >
            ➕ Add another
          </button>
        </div>
      </section>
    );
  }

  return (
    <form
      className="space-y-4 rounded-2xl bg-white p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!amountValid || !mobileValid) return;
        create.mutate(
          {
            donorName: donorName.trim(),
            street: street.trim(),
            houseNo: houseNo.trim() || undefined,
            amount: amountNum,
            mode,
            mobile: mobile || undefined,
            anonymous,
            screenshotUrl: mode === "UPI" && screenshotUrl ? screenshotUrl : undefined,
          },
          { onSuccess: (donation) => setSaved(donation) }
        );
      }}
    >
      <h1 className="text-lg font-bold">Add donation</h1>

      <div>
        <label htmlFor="donorName" className={LABEL_CLASS}>
          Donor name *
        </label>
        <input
          id="donorName"
          type="text"
          required
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="street" className={LABEL_CLASS}>
          Street *
        </label>
        <input
          id="street"
          type="text"
          required
          list="street-options"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className={INPUT_CLASS}
        />
        <datalist id="street-options">
          {(streets.data ?? []).map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div>
        <label htmlFor="houseNo" className={LABEL_CLASS}>
          House no
        </label>
        <input
          id="houseNo"
          type="text"
          value={houseNo}
          onChange={(e) => setHouseNo(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="amount" className={LABEL_CLASS}>
          Amount (₹) *
        </label>
        <input
          id="amount"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          className={INPUT_CLASS}
        />
        <div className="mt-2 flex gap-2">
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(String(a))}
              className={`h-11 flex-1 rounded-lg border text-sm font-semibold ${
                amount === String(a)
                  ? "border-orange-600 bg-orange-50 text-orange-700"
                  : "border-gray-300 text-gray-700 active:bg-gray-100"
              }`}
            >
              ₹{a}
            </button>
          ))}
        </div>
        {amount !== "" && !amountValid && (
          <p className="mt-1 text-xs text-red-600">
            Amount must be between ₹1 and ₹1,00,000
          </p>
        )}
      </div>

      <div>
        <span className={LABEL_CLASS}>Mode *</span>
        <div className="grid grid-cols-2 gap-2">
          {(["CASH", "UPI"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`h-14 rounded-xl border-2 text-lg font-bold ${
                mode === m
                  ? "border-orange-600 bg-orange-50 text-orange-700"
                  : "border-gray-200 text-gray-500 active:bg-gray-50"
              }`}
            >
              {m === "CASH" ? "💵 CASH" : "📱 UPI"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="mobile" className={LABEL_CLASS}>
          Mobile
        </label>
        <input
          id="mobile"
          type="tel"
          inputMode="tel"
          maxLength={10}
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
          className={INPUT_CLASS}
        />
        <p className="mt-1 text-xs text-gray-500">
          If given, you can WhatsApp the receipt
        </p>
        {!mobileValid && (
          <p className="mt-1 text-xs text-red-600">
            Enter a valid 10-digit mobile number
          </p>
        )}
      </div>

      <label className="flex min-h-11 items-center gap-3">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="h-5 w-5 accent-orange-600"
        />
        <span className="text-sm text-gray-700">
          Keep name anonymous on the public wall
        </span>
      </label>

      {mode === "UPI" && (
        <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
          {UPI_ID ? (
            amountValid ? (
              <div className="flex flex-col items-center gap-2">
                <QRCodeSVG
                  value={`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
                    UPI_NAME ?? COMMITTEE_NAME
                  )}&am=${amountNum}&cu=INR&tn=${encodeURIComponent("GU26 Donation")}`}
                  size={192}
                  marginSize={2}
                  className="rounded-lg bg-white p-1"
                />
                <p className="text-center text-sm text-gray-700">
                  Scan to pay ₹{amountNum.toLocaleString("en-IN")} to{" "}
                  <span className="font-mono">{UPI_ID}</span>
                </p>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-600">
                Enter the amount to show the UPI QR
              </p>
            )
          ) : (
            <p className="text-center text-sm text-gray-500">
              UPI QR unavailable — set NEXT_PUBLIC_UPI_ID
            </p>
          )}
          <ScreenshotUpload url={screenshotUrl} onChange={setScreenshotUrl} />
        </div>
      )}

      <button
        type="submit"
        disabled={create.isPending}
        className="h-14 w-full rounded-xl bg-orange-600 text-lg font-bold text-white active:bg-orange-700 disabled:opacity-60"
      >
        {create.isPending ? "Saving…" : "Save donation"}
      </button>
    </form>
  );
}
