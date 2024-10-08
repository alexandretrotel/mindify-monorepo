import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import CookieConsent from "@/components/global/CookieConsent";

export default function AnalyticsProvider({
  children,
  fontSans
}: Readonly<{ children: React.ReactNode; fontSans: { variable: string } }>) {
  let isCookieConsent = false;
  if (typeof window !== "undefined") {
    isCookieConsent = localStorage.getItem("cookieConsent") === "true";
  }

  return (
    <>
      <body
        className={cn(
          "min-h-screen min-w-full bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}

        {isCookieConsent && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        {!isCookieConsent && <CookieConsent />}
      </body>

      {isCookieConsent && (
        <>
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
        </>
      )}
    </>
  );
}
