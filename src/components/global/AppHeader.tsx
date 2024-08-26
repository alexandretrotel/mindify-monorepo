"use client";
import "client-only";

import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  BookIcon,
  BookmarkIcon,
  EyeIcon,
  HomeIcon,
  LibraryIcon,
  UsersRoundIcon,
  VideoIcon
} from "lucide-react";
import { Separator } from "../ui/separator";

const links = [
  { href: "/", label: "Accueil" },
  {
    label: "Découvrir",
    trigger: true,
    children: [
      {
        href: "/discover",
        label: "Votre feed",
        description: "Laissez vous guider par nos recommandations",
        icon: <HomeIcon className="h-4 w-4" />
      },
      {
        href: "/discover/users",
        label: "Utilisateurs",
        description: "Cherchez vos amis et découvrez leurs lectures",
        icon: <UsersRoundIcon className="h-4 w-4" />
      }
    ]
  },
  {
    label: "Librairie",
    trigger: true,
    children: [
      {
        href: "/library",
        label: "Librairie",
        description: "Trouvez vos prochaines lectures",
        icon: <LibraryIcon className="h-4 w-4" />
      },
      {
        href: "/library?source=book",
        label: "Livres",
        description: "Découvrez nos résumés de livres",
        icon: <BookIcon className="h-4 w-4" />
      },
      {
        href: "/library?source=videos",
        label: "Vidéos",
        description: "Découvrez nos résumés de vidéos",
        icon: <VideoIcon className="h-4 w-4" />
      },
      {
        href: "/library?status=not_started",
        label: "À commencer",
        description: "Commencez vos prochaines lectures",
        icon: <EyeIcon className="h-4 w-4" />
      },
      {
        href: "/library?status=saved",
        label: "Sauvegardés",
        description: "Retrouvez vos résumés sauvegardés",
        icon: <BookmarkIcon className="h-4 w-4" />
      }
    ]
  }
];

type ListItemProps = {
  className?: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  lastItem?: boolean;
} & React.ComponentPropsWithoutRef<typeof Link>;

const ListItem = React.forwardRef<React.ElementRef<typeof Link>, ListItemProps>(
  ({ className, title, icon, lastItem, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="flex h-full items-start gap-4 rounded-lg">
              <div className="flex h-full items-start justify-start rounded-lg bg-accent p-2">
                <div className="flex aspect-square h-full w-full items-center justify-center">
                  {icon}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-medium leading-none">{title}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
                </p>
              </div>
            </div>
          </Link>
        </NavigationMenuLink>

        {!lastItem && (
          <div className="md:hidden">
            <Separator className="my-2" />
          </div>
        )}
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

const AppHeader = ({
  children,
  isNotTransparent,
  isNotFixed
}: {
  children: React.ReactNode;
  isNotTransparent?: boolean;
  isNotFixed?: boolean;
}) => {
  return (
    <header
      className={`${isNotFixed ? "block" : "fixed"} relative inset-x-0 top-0 z-50 px-4 py-4 md:px-8 ${isNotTransparent ? "bg-background" : ""} flex w-full justify-center border-b border-black/10 backdrop-blur-2xl transition-colors duration-300 dark:border-white/10`}
    >
      <NavigationMenu className="flex w-full max-w-7xl items-center justify-between">
        <NavigationMenuList>
          {links?.map((link) => (
            <NavigationMenuItem key={link.href}>
              {link.trigger ? (
                <React.Fragment>
                  <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                  <NavigationMenuContent className="max-w-xs md:max-w-2xl">
                    <ul className="grid w-full gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {link.children?.map((child, index) => (
                        <ListItem
                          key={child.href}
                          href={child.href}
                          title={child.label}
                          icon={child.icon}
                          lastItem={index === link?.children?.length - 1}
                        >
                          {child.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </React.Fragment>
              ) : (
                <Link key={link.href} href={link.href ?? ""} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {link.label}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>

        <div className="flex items-center gap-4">{children}</div>
      </NavigationMenu>
    </header>
  );
};

export default AppHeader;
