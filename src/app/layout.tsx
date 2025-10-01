import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coit Cache - Limited Edition Collectible",
  description: "Limited by design. Coit Cache collectible - only 250 made. A unique piece of San Francisco history.",
  metadataBase: new URL("https://wassuh.com"),
  openGraph: {
    title: "Coit Cache - Limited Edition Collectible",
    description: "Limited by design. Coit Cache collectible - only 250 made.",
    url: "https://wassuh.com",
    siteName: "wassuh",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coit Cache - Limited Edition Collectible",
    description: "Limited by design. Only 250 made.",
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
