import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Savoir",
  description:
    "Savoir est une plateforme vous permettant d'élargir vos connaissances à partir de résumés de livres."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light">
      <body
        className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}
      >
        {children}
      </body>
    </html>
  );
}
