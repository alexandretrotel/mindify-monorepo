// Import global styles
import "./globals.css";
import "@radix-ui/themes/styles.css";

import type { Metadata, Viewport } from "next";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from "nextjs-toploader";
import { Toaster as Sonner } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { loadStripe } from "@stripe/stripe-js";
import StripeClient from "@/app/StripeClient";
import Loading from "@/app/loading";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import FlashcardProvider from "@/providers/FlashcardProvider";
import OnboardingProvider from "@/providers/OnboardingProvider";
import NotificationsProvider from "@/providers/NotificationsProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Mindify",
  description:
    "Mindify est une plateforme vous permettant d'élargir vos connaissances à partir de résumés de livres.",
  generator: "Next.js",
  applicationName: "Mindify",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Mindify",
    "Lecture",
    "Résumé",
    "Podcast",
    "Vidéo",
    "Connaissance",
    "Apprentissage",
    "Livre",
    "Audiobook",
    "Ebook"
  ],
  authors: [{ name: "Alexandre Trotel" }, { name: "Mélanie Ramarozatovo" }],
  creator: "Alexandre Trotel",
  publisher: "Alexandre Trotel",
  metadataBase: new URL("https://mindify.fr"),
  alternates: {
    canonical: "/",
    languages: {
      fr: "/"
    }
  },
  openGraph: {
    title: "Mindify",
    description:
      "Mindify est une plateforme vous permettant d'élargir vos connaissances à partir de résumés de livres, de podcasts et de vidéos.",
    type: "website",
    url: "https://mindify.fr",
    siteName: "Mindify",
    locale: "fr_FR",
    images: [
      {
        url: "/open-graph/og-image.png",
        width: 600,
        height: 600,
        alt: "Mindify"
      }
    ]
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: "/ios/512.png",
    apple: "/ios/512.png",
    shortcut: "/ios/512.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/ios/512.png"
    }
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "Mindify",
    creator: "@trotelalexandre",
    description:
      "Mindify est une plateforme vous permettant d'élargir vos connaissances à partir de résumés de livres, de podcasts et de vidéos.",
    images: { url: "/open-graph/og-image.png", alt: "Mindify" }
  },
  appleWebApp: {
    title: "Mindify",
    statusBarStyle: "black-translucent",
    startupImage: [
      "/icons/ios/512.png",
      {
        url: "/icons/ios/512.png",
        media: "(device-width: 768px) and (device-height: 1024px)"
      }
    ]
  },
  category: "education"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export const stripePromise = loadStripe(process.env.STRIPE_SECRET_KEY!);

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen min-w-full bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextTopLoader color="#1FA856" showSpinner={false} />

        <Suspense fallback={<Loading />}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NotificationsProvider>
              <OnboardingProvider>
                <FlashcardProvider>
                  <StripeClient stripePromise={stripePromise}>
                    {children}

                    <Sonner />
                    <Toaster />
                  </StripeClient>
                </FlashcardProvider>
              </OnboardingProvider>
            </NotificationsProvider>
          </ThemeProvider>
        </Suspense>

        <Analytics />
        <SpeedInsights />
      </body>

      <Script id="hotjar" strategy="lazyOnload">
        {`(function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:5123190,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
      </Script>

      <GoogleAnalytics gaId="G-K3J5KW3Q3R" />
    </html>
  );
}
