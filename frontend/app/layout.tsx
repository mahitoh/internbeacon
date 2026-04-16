import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "InternBeacon — Elite internships in Cameroon",
  description:
    "Curated internships and employer tools for students and companies in Cameroon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", plusJakartaSans.variable, cormorantGaramond.variable, "font-sans", geist.variable)}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="min-h-full flex flex-col font-body text-on-surface bg-background">
        {children}
      </body>
    </html>
  );
}
