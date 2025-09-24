import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "wassuh - its wassuh",
  description: "Product showcase of limited drop runs",
  metadataBase: new URL("https://wassuh.com"),
  openGraph: {
    title: "wassuh - its wassuh",
    description: "Product showcase of limited drop runs",
    url: "https://wassuh.com",
    siteName: "wassuh",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "wassuh - its wassuh",
    description: "Product showcase of limited drop runs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
