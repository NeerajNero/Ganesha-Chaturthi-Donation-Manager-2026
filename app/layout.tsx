import type { Metadata, Viewport } from "next";
import { Inter, Yatra_One } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { COMMITTEE_NAME } from "@/lib/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const yatraOne = Yatra_One({
  variable: "--font-yatra",
  weight: "400",
  subsets: ["latin", "devanagari"],
});

export const metadata: Metadata = {
  title: `${COMMITTEE_NAME} — Donations`,
  description: "Door-to-door donation collection for Ganesh Utsav 2026",
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "GU26",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#7b1e26",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${yatraOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
