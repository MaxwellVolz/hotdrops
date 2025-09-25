import type { Metadata } from "next";
import "./globals.css";

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
        className="font-sans antialiased"
      >
        {children}
      </body>
    </html>
  );
}
