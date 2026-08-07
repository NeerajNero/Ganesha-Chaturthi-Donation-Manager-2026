import { ImageResponse } from "next/og";
import { getWallData } from "@/lib/public-data";
import { COMMITTEE_NAME, GOAL_AMOUNT } from "@/lib/config";

export const dynamic = "force-dynamic";

export const alt = `${COMMITTEE_NAME} — donation wall`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rupees = (n: number) => `Rs ${n.toLocaleString("en-IN")}`;

export default async function Image() {
  const { grandTotal, donations } = await getWallData();
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
          background: "#fff8ee",
          color: "#2d1b12",
          fontSize: 32,
        }}
      >
        <div style={{ display: "flex", fontSize: 80 }}>🪔</div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 44,
            fontWeight: 700,
            color: "#7b1e26",
          }}
        >
          Donation Transparency Wall
        </div>
        <div style={{ display: "flex", marginTop: 8, fontSize: 30, color: "#2d1b1299" }}>
          {COMMITTEE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 76,
            fontWeight: 700,
            color: "#7b1e26",
          }}
        >
          {rupees(grandTotal)}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#2d1b1299" }}>
          from {donations.length}+ donors - every rupee accounted for
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            width: 700,
            height: 26,
            borderRadius: 13,
            background: "#7b1e2622",
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
        <div style={{ display: "flex", marginTop: 12, fontSize: 26, color: "#2d1b1299" }}>
          {progress}% of {rupees(GOAL_AMOUNT)} goal
        </div>
      </div>
    ),
    size
  );
}
