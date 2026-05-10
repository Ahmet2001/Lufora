import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Lufora — Grow smarter, together.",
  description:
    "AI-powered social plant care app. Track your plants, grow from seeds, and join a community of plant lovers.",
  keywords: ["plants", "plant care", "gardening", "grow journey", "plant health"],
  authors: [{ name: "Lufora" }],
  verification: {
    google: "L7CJKImj6FZ3kPsuuPpVMBRuDKvvQ_-pd7kWQxVd79A",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#22c55e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
