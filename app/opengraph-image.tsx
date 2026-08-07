import { ImageResponse } from "next/og";
import { getWallData } from "@/lib/public-data";
import { COMMITTEE_NAME, FESTIVAL_DATES, GOAL_AMOUNT } from "@/lib/config";

export const dynamic = "force-dynamic";

export const alt = `${COMMITTEE_NAME} — donations`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rupees = (n: number) => `Rs ${n.toLocaleString("en-IN")}`;

export default async function Image() {
  const { grandTotal } = await getWallData();
  const progress = Math.min(100, Math.round((grandTotal / GOAL_AMOUNT) * 100));

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
          color: "#fff8ee",
          fontSize: 32,
        }}
      >
        <div style={{ display: "flex", fontSize: 90 }}>🙏</div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 56,
            fontWeight: 700,
            color: "#ffd873",
          }}
        >
          {COMMITTEE_NAME}
        </div>
        <div style={{ display: "flex", marginTop: 12, color: "#fff8eecc" }}>
          {FESTIVAL_DATES} - Donation & transparency wall
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 64,
            fontWeight: 700,
            color: "#d4af37",
          }}
        >
          {rupees(grandTotal)} collected
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            width: 700,
            height: 26,
            borderRadius: 13,
            background: "#fff8ee33",
          }}
        >
          <div
            style={{
              display: "flex",
              width: `${Math.max(progress, 2)}%`,
              height: 26,
              borderRadius: 13,
              background: "#d4af37",
            }}
          />
        </div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 28, color: "#fff8eecc" }}>
          {progress}% of {rupees(GOAL_AMOUNT)} goal
        </div>
      </div>
    ),
    size
  );
}
