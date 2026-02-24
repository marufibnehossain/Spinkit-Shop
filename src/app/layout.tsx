import type { Metadata } from "next";
import { Oswald, DM_Sans } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import StoreShell from "@/components/StoreShell";

/** Headings: Obviously-style (condensed, bold). Use next/font/local with Obviously.woff2 if you have a license. */
const displayFont = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

/** Body: Neue Montreal–style (clean geometric sans). Use next/font/local with Neue Montreal if you have a license. */
const sansFont = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spinkit Shop — Table Tennis Equipment",
  description: "Play Better. Play Stronger. Play Smarter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <StoreShell>{children}</StoreShell>
        </SessionProvider>
      </body>
    </html>
  );
}
