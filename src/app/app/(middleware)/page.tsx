import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Library from "@/app/app/(middleware)/components/tabs/Library";
import Discover from "@/app/app/(middleware)/components/tabs/Discover";
import AccountDropdown from "@/components/global/AccountDropdown";

export default async function Home() {
  return (
    <Tabs defaultValue="discover" className="flex flex-col gap-6 md:gap-12">
      <header className="flex w-full items-center justify-between">
        <TabsList className="grid grid-cols-2 md:w-1/2">
          <TabsTrigger value="discover">Découvrir</TabsTrigger>
          <TabsTrigger value="my-library">Librairie</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <AccountDropdown />
        </div>
      </header>

      <main>
        <TabsContent value="discover">
          <Discover />
        </TabsContent>

        <TabsContent value="my-library">{/* <Library /> */}</TabsContent>
      </main>
    </Tabs>
  );
}
