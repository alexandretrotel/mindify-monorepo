"use client";

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
import ToggleTheme from "@/components/global/toggleTheme";
import H2 from "@/components/typography/h2";

const navigation = [
  { name: "Accueil", href: "#Accueil" },
  { name: "Fonctionnalités", href: "#Fonctionnalités" },
  { name: "Témoignages", href: "#Témoignages" },
  { name: "Prix", href: "#Prix" },
  { name: "FAQ", href: "#FAQ" }
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrolltoHash = function (element_id: string) {
    const element = document.getElementById(element_id);
    element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-2xl transition-colors duration-300 ${isScrolled ? "border-b border-black/10 dark:border-white/10" : "border-b border-transparent"}`}
    >
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="#">
            <span className="sr-only">Savoir</span>
            <H2>Savoir</H2>
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
          <Button asChild variant="outline">
            <Link href="/login">Se connecter</Link>
          </Button>
          <ToggleTheme />
        </div>
      </nav>
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-black/10 dark:sm:ring-white/10">
          <div className="flex items-center justify-between">
            <Link href="#">
              <span className="sr-only">Savoir</span>
              <H2>Savoir</H2>
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
                      setMobileMenuOpen(false);
                      scrolltoHash(item.href);
                    }}
                    className="-mx-3 block rounded-md px-3 py-2 text-base font-medium hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="py-6">
                <Button asChild>
                  <Link href="/login">Se connecter</Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
