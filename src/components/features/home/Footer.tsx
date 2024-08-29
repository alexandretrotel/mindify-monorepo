import { JSX, Suspense, SVGProps } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Logo from "@/../public/logos/mindify-square.svg";
import H2 from "@/components/typography/h2";
import { Muted } from "@/components/typography/muted";
import Semibold from "@/components/typography/semibold";
import FeaturesDialog from "@/components/features/support/FeaturesDialog";
import BugDialog from "@/components/features/support/BugDialog";
import type { UUID } from "crypto";
import FeaturesCounterSkeleton from "@/components/features/support/skeleton/FeaturesCounterSkeleton";
import FeaturesCounter from "@/components/features/support/counter/FeaturesCounter";
import BugsCounter from "@/components/features/support/counter/BugsCounter";
import BugsCounterSkeleton from "@/components/features/support/skeleton/BugsCounterSkeleton";

export default function Footer({
  userId,
  isConnected
}: Readonly<{ userId: UUID; isConnected: boolean }>) {
  const navigation = {
    "learn-more": [{ name: "En savoir plus", href: "/about" }],
    support: [
      {
        component: (
          <Link
            href="/support/all"
            className="text-sm text-muted-foreground hover:text-black dark:hover:text-white"
          >
            Roadmap
          </Link>
        )
      },
      {
        component: (
          <BugDialog userId={userId} isConnected={isConnected}>
            <Suspense fallback={<BugsCounterSkeleton />}>
              <BugsCounter userId={userId} isConnected={isConnected} />
            </Suspense>
          </BugDialog>
        )
      },
      {
        component: (
          <FeaturesDialog userId={userId} isConnected={isConnected}>
            <Suspense fallback={<FeaturesCounterSkeleton />}>
              <FeaturesCounter userId={userId} isConnected={isConnected} />
            </Suspense>
          </FeaturesDialog>
        )
      }
    ],
    legal: [
      { name: "Politique de confidentialité", href: "/privacy-policy" },
      { name: "Conditions d'utilisation", href: "/terms-of-service" }
    ],
    social: [
      {
        name: "Facebook",
        disable: true,
        href: "#",
        icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        )
      },
      {
        name: "Instagram",
        disable: true,
        href: "#",
        icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
              clipRule="evenodd"
            />
          </svg>
        )
      },
      {
        name: "X",
        disable: true,
        href: "#",
        icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
          </svg>
        )
      },
      {
        name: "YouTube",
        disable: true,
        href: "#",
        icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
              clipRule="evenodd"
            />
          </svg>
        )
      }
    ]
  };

  return (
    <footer aria-labelledby="footer-heading">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="flex flex-col items-start justify-between gap-16 md:flex-row">
          <div className="flex max-w-sm flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src={Logo} alt="Mindify" width={32} height={32} />
              <H2>Mindify</H2>
            </Link>
            <Muted>La lecture à portée de main, la connaissance pour vous demain.</Muted>
            {navigation && (
              <div className="flex space-x-6">
                {navigation.social.map((item) => {
                  if (!item.disable)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-muted-foreground hover:text-black dark:hover:text-white"
                      >
                        <item.icon aria-hidden="true" className="h-6 w-6" />
                      </Link>
                    );
                })}
              </div>
            )}
          </div>

          <div className="flex w-full flex-col items-start justify-evenly gap-8 md:flex-row md:gap-16">
            <div className="flex flex-col gap-4">
              <Semibold>À propos</Semibold>
              <ul className="flex flex-col gap-4">
                {navigation["learn-more"].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-black dark:hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <Semibold>Support</Semibold>
              <ul className="flex flex-col gap-4">
                {navigation.support.map((item, index) => (
                  <li key={index}>{item?.component}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <Semibold>Légal</Semibold>
              <ul className="flex flex-col gap-4">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-black dark:hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="py-8">
          <Separator />
        </div>

        <Muted size="sm">&copy; {new Date().getFullYear()} Mindify. Tous droits réservés.</Muted>
      </div>
    </footer>
  );
}
