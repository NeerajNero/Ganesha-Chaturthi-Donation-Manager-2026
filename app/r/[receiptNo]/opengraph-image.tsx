import { ImageResponse } from "next/og";
import { getReceipt } from "@/lib/public-data";
import { COMMITTEE_NAME } from "@/lib/config";

export const alt = `Donation receipt — ${COMMITTEE_NAME}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rupees = (n: number) => `Rs ${n.toLocaleString("en-IN")}`;

export default async function Image({
  params,
}: {
  params: Promise<{ receiptNo: string }>;
}) {
  const { receiptNo } = await params;
  const receipt = await getReceipt(receiptNo);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#7b1e26",
          fontSize: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#fff8ee",
            borderRadius: 32,
            padding: "56px 90px",
            border: "6px solid #d4af37",
          }}
        >
          <div style={{ display: "flex", fontSize: 64 }}>🙏</div>
          <div
            style={{
              display: "flex",
              marginTop: 10,
              fontSize: 34,
              fontWeight: 700,
              color: "#7b1e26",
            }}
          >
            {COMMITTEE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 6,
              fontSize: 24,
              color: "#2d1b1299",
              letterSpacing: 4,
            }}
          >
            DONATION RECEIPT
          </div>
          {receipt ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 26,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 80,
                  fontWeight: 700,
                  color: "#7b1e26",
                }}
              >
                {rupees(receipt.amount)}
              </div>
              <div style={{ display: "flex", marginTop: 8, fontSize: 32, color: "#2d1b12" }}>
                from {receipt.donorName}
              </div>
              <div style={{ display: "flex", marginTop: 12, fontSize: 26, color: "#2d1b1280" }}>
                {receipt.receiptNo} - Thank you for your generosity
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", marginTop: 26, fontSize: 36, color: "#2d1b12" }}>
              Thank you for your generous donation
            </div>
          )}
        </div>
      </div>
    ),
    size
  );
}
