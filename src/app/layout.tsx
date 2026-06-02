import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "কৃষি এআই - স্মার্ট কৃষি সহায়ক",
  description: "বাংলাদেশের কৃষকদের জন্য এআই চালিত কৃষি সহায়ক। ফসল রোগ নির্ণয়, কৃষি পরামর্শ, বাজার মূল্য ও আবহাওয়া তথ্য।",
  keywords: ["কৃষি", "এআই", "বাংলাদেশ", "কৃষক", "ফসল", "রোগ নির্ণয়", "Krishi AI", "agriculture"],
  authors: [{ name: "Krishi AI Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "কৃষি এআই - স্মার্ট কৃষি সহায়ক",
    description: "বাংলাদেশের কৃষকদের জন্য এআই চালিত কৃষি সহায়ক",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1B5E20",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
