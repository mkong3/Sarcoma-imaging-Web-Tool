import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sarcoma Imaging Follow-up Planner (prototype)",
  description:
    "Prototype clinician-facing planner for postoperative soft tissue tumour imaging surveillance, sourced from the ESSR 2024 guidelines.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
