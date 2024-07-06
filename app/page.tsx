import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Faq from "@/components/home/faq";
import Testimonials from "@/components/home/testimonials";
import Pricing from "@/components/home/pricing";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/actions/auth";
import { BellRingIcon, CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <Hero />
          <Testimonials />
          <Pricing />
          <Faq />
        </main>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto flex h-screen max-w-7xl flex-col justify-between p-8 py-12">
        <header className="flex w-full items-center justify-between">
          <NavigationMenu className="flex items-center gap-4">
            <NavigationMenuList className="flex items-center gap-4">
              <NavigationMenuItem>
                <Button variant="link" className="p-0 text-foreground" size="sm" asChild>
                  <Link href="/book-of-the-week">Le livre de la semaine</Link>
                </Button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button variant="link" className="p-0 text-foreground" size="sm" asChild>
                  <Link href="/library">La bibliothèque</Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={data.user.user_metadata.avatar_url}
                    alt={data.user.user_metadata.name}
                  />
                  <AvatarFallback>{data.user.user_metadata.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="bottom">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/account?category=profile" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/account?category=subscription" className="flex items-center gap-2">
                    <CreditCardIcon className="h-4 w-4" /> Abonnement
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/account?category=notifications" className="flex items-center gap-2">
                    <BellRingIcon className="h-4 w-4" /> Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/account?category=settings" className="flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" /> Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form method="POST" action={signOut}>
                    <button type="submit" className="flex items-center gap-2">
                      <LogOutIcon className="h-4 w-4" /> Déconnexion
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main></main>
      </div>
    </>
  );
}
