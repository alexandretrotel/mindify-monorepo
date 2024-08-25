"use client";
import "client-only";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const activeLink = "font-semibold text-foreground text-sm";
const inactiveLink = "font-semibold text-muted-foreground text-sm hover:text-foreground";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/discover", label: "Découvrir" },
  { href: "/library", label: "Librairie" }
];

const AppHeader = ({
  children,
  isNotTransparent,
  isNotFixed
}: {
  children: React.ReactNode;
  isNotTransparent?: boolean;
  isNotFixed?: boolean;
}) => {
  const pathname = usePathname();

  return (
    <header
      className={`${isNotFixed ? "block" : "fixed"} inset-x-0 top-0 z-50 ${isNotTransparent ? "bg-white" : ""} flex w-full justify-center border-b border-black/10 backdrop-blur-2xl transition-colors duration-300 dark:border-white/10`}
    >
      <div className="flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-8">
          {links?.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? activeLink : inactiveLink}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">{children}</div>
      </div>
    </header>
  );
};

export default AppHeader;
