import type { Metadata } from "next";
import { Lato } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import StoreShell from "@/components/StoreShell";

/** Primary typeface: Neue Montreal for all text (body + headings). */
const neueMontreal = localFont({
  src: [
    { path: "./fonts/NeueMontreal-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/NeueMontreal-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/NeueMontreal-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/NeueMontreal-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

/** Lato: use font-lato where needed later. */
const latoFont = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
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
    <html lang="en" className={`${neueMontreal.variable} ${latoFont.variable}`}>
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <StoreShell>{children}</StoreShell>
        </SessionProvider>
      </body>
    </html>
  );
}
