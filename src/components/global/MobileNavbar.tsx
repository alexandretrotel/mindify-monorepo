"use client";
import "client-only";

import React from "react";
import { HomeIcon, GraduationCapIcon, BookIcon, UserIcon } from "lucide-react";
import type { UUID } from "crypto";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { features } from "@/data/features";

export default function MobileNavbar({
  userId,
  isConnected
}: Readonly<{
  userId: UUID;
  isConnected: boolean;
}>) {
  const [isMobile, setIsMobile] = React.useState(false);

  const pathname = usePathname();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const menuItems = [
    {
      name: "Accueil",
      href: !isConnected ? "/" : "/library",
      icon: <HomeIcon />
    },
    {
      name: "Apprendre",
      href: "/learn",
      icon: <GraduationCapIcon />
    },
    {
      name: "Profil",
      href: `/profile/${userId}`,
      icon: <UserIcon />,
      condition: isConnected
    }
  ];

  if (!isMobile || !features.canLogIn) {
    return null;
  }

  return (
    <div className="pt-24">
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background shadow-md">
        <ul className="flex justify-around pb-6 pt-2">
          {menuItems.map((item, index) => {
            if (item.condition === false) {
              return null;
            }

            return (
              <li key={index} className="flex flex-col items-center">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 ${pathname === item.href ? "text-foreground" : "text-muted-foreground"} hover:text-foreground`}
                >
                  {item.icon}
                  <span className="text-xs">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
