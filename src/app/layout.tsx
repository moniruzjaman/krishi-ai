import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from "@/components/krishi/ThemeProvider";

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
  appleWebApp: {
    capable: true,
    title: "কৃষি এআই",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "কৃষি এআই - স্মার্ট কৃষি সহায়ক",
    description: "বাংলাদেশের কৃষকদের জন্য এআই চালিত কৃষি সহায়ক",
    type: "website",
  },
  other: {
    "mobile-web-app-capable": "yes",
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
        {/* esbuild/SWC `keepNames` shim.
            next-themes renders its pre-paint theme script by stringifying a
            minified function (`fn.toString()`). Minifiers annotate named
            functions with `__name(fn, "fn")`, but the helper is not in scope
            inside the inlined string, so the script throws before it can apply
            the theme — causing a flash of the wrong theme on first paint.
            Defining the helper globally first makes the inlined script work.
            Keep this above <ThemeProvider>. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.__name=window.__name||function(f,n){Object.defineProperty(f,'name',{value:n,configurable:true});return f};",
          }}
        />
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
