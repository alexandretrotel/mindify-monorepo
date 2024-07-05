import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/providers/theme";

import "./globals.css";
import Head from "next/head";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Mindify",
  description:
    "Mindify est une plateforme vous permettant d'élargir vos connaissances à partir de résumés de livres."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <Head>
        <></>
      </Head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
