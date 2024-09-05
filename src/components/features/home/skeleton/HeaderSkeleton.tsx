"use client";
import "client-only";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import ToggleTheme from "@/components/global/ToggleTheme";
import H2 from "@/components/typography/h2";
import Banner from "@/components/features/home/Banner";
import Logo from "@/../public/logos/mindify-square.svg";
import Image from "next/image";

const navigation = [
  { name: "Accueil", href: "#home" },
  { name: "Nos services", href: "#service" },
  { name: "Témoignages", href: "#testimonials" },
  { name: "Offres", href: "#pricing" },
  { name: "FAQ", href: "#faq" }
];

export default function HeaderSkeleton() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky inset-x-0 top-0 z-50 backdrop-blur-2xl transition-colors duration-300 ${isScrolled ? "border-b border-black/10 dark:border-white/10" : "border-b border-transparent"}`}
    >
      <Banner />
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="sr-only">Mindify</span>
            <Image src={Logo} alt="Mindify" width={32} height={32} />
            <H2>Mindify</H2>
          </Link>
        </div>
        <div className="flex items-center gap-4 lg:hidden">
          <ToggleTheme />
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-black dark:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <NavigationMenu>
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={`/${item.href}`} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="hidden gap-4 lg:flex lg:flex-1 lg:justify-end">
          <Button asChild variant="outline" disabled>
            <Link href="/app/login">Se connecter</Link>
          </Button>
          <ToggleTheme />
        </div>
      </nav>
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="hide-scrollbar fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-black/10 dark:sm:ring-white/10">
          <div className="flex items-center justify-between">
            <Link href="/">
              <span className="sr-only">Mindify</span>
              <H2>Mindify</H2>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-black dark:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Fermer le menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-black/10 dark:divide-white/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      const element = document.querySelector(item.href);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }

                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors duration-300 hover:bg-slate-100 focus:bg-slate-100 focus:outline-none dark:hover:bg-slate-900 dark:focus:bg-slate-900"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="py-6">
                <Button asChild disabled>
                  <Link href="/app/login">Se connecter</Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
