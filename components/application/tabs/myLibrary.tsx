import React, { useEffect } from "react";
import TypographyH3 from "@/components/typography/h3";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { Topics } from "@/types/topics/topics";
import BookCover from "@/components/global/bookCover";
import Link from "next/link";

const statuts = [
  { id: 1, name: "Pas commencés" },
  { id: 2, name: "Nouveautés" },
  { id: 3, name: "Enregistrés" },
  { id: 4, name: "Terminés" }
];

const MyLibrary = ({ topics }: { topics: Topics }) => {
  const [book, setBook] = React.useState<string | undefined>(undefined);
  const [selectedTopic, setSelectedTopic] = React.useState<string | undefined>(undefined);
  const [selectedStatut, setSelectedStatut] = React.useState<string | undefined>(undefined);

  const sortedTopics = topics ? [...topics]?.sort((a, b) => a.name.localeCompare(b.name)) : [];

  useEffect(() => {
    if (selectedTopic === "Par catégorie") {
      setSelectedTopic(undefined);
    }

    if (selectedStatut === "Par statut") {
      setSelectedStatut(undefined);
    }
  }, [selectedTopic, selectedStatut]);

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

        <div className="grid grid-cols-2 gap-4">
          {/* Catégories */}
          <Select value={selectedTopic ?? "Par catégorie"} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-full lg:min-w-[200px]">
              <SelectValue>{selectedTopic ?? "Par catégorie"}</SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="Par catégorie">Par catégorie</SelectItem>
                <SelectSeparator />
                <SelectLabel>Catégories</SelectLabel>
                {sortedTopics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.name}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Enregistrés, terminés, etc */}
          <Select value={selectedStatut ?? "Par statut"} onValueChange={setSelectedStatut}>
            <SelectTrigger className="w-full lg:min-w-[200px]">
              <SelectValue>{selectedStatut ?? "Par statut"}</SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="Par statut">Par statut</SelectItem>
                <SelectSeparator />
                <SelectLabel>Statuts</SelectLabel>
                {statuts.map((statut) => (
                  <SelectItem key={statut.id} value={statut.name}>
                    {statut.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
