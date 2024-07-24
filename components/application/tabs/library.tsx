"use client";
import "client-only";

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
import type { Summaries } from "@/types/summary/summary";

const statuts = [
  { id: 1, name: "Pas commencé" },
  { id: 2, name: "Nouveau" },
  { id: 3, name: "Enregistré" },
  { id: 4, name: "Terminé" }
];

const summaries: Summaries = Array.from({ length: 20 })?.map((_, index) => ({
  id: index,
  title: "The Lean Startup",
  author: "Eric Ries",
  image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  created_at: new Date(),
  slug: "the-lean-startup",
  author_slug: "eric-ries"
})) as Summaries;

const Library = ({ topics }: { topics: Topics }) => {
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
      <TypographyH3>Librairie</TypographyH3>

      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <div className="min-w-md relative max-w-md flex-1">
          <SearchIcon className="absolute left-2 top-3 flex h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Titre, auteur, etc..."
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
        {summaries?.map((summary, index) => (
          <Link href={`/summary/${summary.author_slug}/${summary.slug}`} key={index}>
            <BookCover title="L'art de la guerre" author="Sun Tzu" category="Histoire" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Library;
