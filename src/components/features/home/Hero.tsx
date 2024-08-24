import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchIcon } from "lucide-react";
import H1 from "@/components/typography/h1";
import P from "@/components/typography/p";
import Topics from "@/components/features/home/hero/Topics";
import { Suspense } from "react";
import TopicsSkeleton from "@/components/features/home/hero/skeleton/TopicsSkeleton";

const Hero = async () => {
  return (
    <section id="home" className="flex items-center justify-center px-4 pt-32 md:h-screen md:pt-0">
      <div className="hide-scrollbar relative text-center">
        <div className="mx-auto flex max-w-xl flex-col gap-2 text-center">
          <H1>Mindify</H1>
          <P>
            Deviens + intelligent avec des connaissances extraits de livres, articles, podcasts et
            vidéos.
          </P>
        </div>
        <div className="relative mx-auto mt-7 max-w-xl sm:mt-12">
          <form>
            <div className="relative z-10 flex space-x-3 rounded-lg border bg-background p-3 shadow-lg">
              <div className="flex-[1_0_0%]">
                <Label htmlFor="summary" className="sr-only">
                  Recherche du contenu
                </Label>
                <Input
                  name="summary"
                  className="h-full"
                  id="summary"
                  placeholder="Recherche du contenu"
                />
              </div>
              <div className="flex-[0_0_auto]">
                <Button size={"icon"}>
                  <SearchIcon />
                </Button>
              </div>
            </div>
          </form>

          <div className="absolute end-0 top-0 hidden -translate-y-12 translate-x-20 md:block">
            <svg
              className="h-auto w-16 text-primary"
              width={121}
              height={135}
              viewBox="0 0 121 135"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                stroke="currentColor"
                strokeWidth={10}
                strokeLinecap="round"
              />
              <path
                d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                stroke="currentColor"
                strokeWidth={10}
                strokeLinecap="round"
              />
              <path
                d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                stroke="currentColor"
                strokeWidth={10}
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="absolute bottom-0 start-0 hidden -translate-x-32 translate-y-10 md:block">
            <svg
              className="h-auto w-40 text-primary"
              width={347}
              height={188}
              viewBox="0 0 347 188"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                stroke="currentColor"
                strokeWidth={7}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <Suspense fallback={<TopicsSkeleton />}>
          <Topics />
        </Suspense>
      </div>
    </section>
  );
};

export default Hero;
