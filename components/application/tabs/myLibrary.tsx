import React from "react";
import TypographyH3 from "@/components/typography/h3";
import { Input } from "@/components/ui/input";
import { SearchIcon, ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Topics } from "@/types/topics/topics";
import BookCover from "@/components/global/bookCover";
import Link from "next/link";

const statuts = [
  { name: "Enregistrés", slug: "saved" },
  { name: "Terminés", slug: "completed" }
];

const MyLibrary = ({ topics }: { topics: Topics }) => {
  const [book, setBook] = React.useState<string | undefined>(undefined);
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = React.useState<string>("");
  const [selectedStatut, setSelectedStatut] = React.useState<string>("");

  const sortedTopics = [...topics]?.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex w-full flex-col gap-4">
      <TypographyH3>Ma librairie</TypographyH3>

      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <div className="min-w-md relative max-w-md flex-1">
          <SearchIcon className="absolute left-2 top-3 flex h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un résumé"
            className="w-full rounded-lg bg-background pl-8"
            value={book ?? ""}
            onChange={(e) => setBook(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Catégories */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" aria-expanded={open} className="w-[200px] justify-between">
                {selectedTopic
                  ? sortedTopics?.find((topic) => topic.slug === selectedTopic)?.name
                  : "Toutes les catégories"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Filtrer par catégorie" />
                <CommandEmpty>Pas de catégorie trouvée</CommandEmpty>
                <CommandGroup>
                  {sortedTopics?.map((topic) => (
                    <CommandItem
                      key={topic.slug}
                      value={topic.slug}
                      onSelect={(currentValue) => {
                        setSelectedTopic(currentValue === selectedTopic ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTopic === topic.slug ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {topic.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Enregistrés, terminés, etc */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" aria-expanded={open} className="w-[200px] justify-between">
                {selectedStatut
                  ? statuts?.find((statut) => statut.slug === selectedStatut)?.name
                  : "Tous les statuts"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Filtrer par statut" />
                <CommandEmpty>Pas de statut trouvé</CommandEmpty>
                <CommandGroup>
                  {statuts?.map((statut) => (
                    <CommandItem
                      key={statut.slug}
                      value={statut.slug}
                      onSelect={(currentValue) => {
                        setSelectedStatut(currentValue === selectedStatut ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedStatut === statut.slug ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {statut.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <Link href="/" key={index}>
            <BookCover title="L'art de la guerre" author="Sun Tzu" category="Histoire" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyLibrary;
