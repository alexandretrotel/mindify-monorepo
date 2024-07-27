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
import type { Authors, Source, Sources, Summaries } from "@/types/summary/summary";
import { sourceToString } from "@/utils/topics";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import type { Statuses, SummaryStatus, UserLibrary, UserReads } from "@/types/user";
import { statusToString } from "@/utils/summary";
import Fuse from "fuse.js";

const statuses: Statuses = [
  { id: 1, name: "Pas commencé", value: "not_started" },
  { id: 2, name: "Enregistré", value: "saved" },
  { id: 3, name: "Terminé", value: "completed" }
] as Statuses;

const sources: Sources = ["book", "article", "podcast", "video"] as Sources;

const Library = ({
  topics,
  summaries,
  authors,
  userReads,
  userLibrary
}: {
  topics: Topics;
  summaries: Summaries;
  authors: Authors;
  userReads: UserReads;
  userLibrary: UserLibrary;
}) => {
  const [book, setBook] = React.useState<string | undefined>(undefined);
  const [selectedTopic, setSelectedTopic] = React.useState<string | undefined>(undefined);
  const [selectedSource, setSelectedSource] = React.useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = React.useState<string | undefined>(undefined);
  const [filteredSummaries, setFilteredSummaries] = React.useState<Summaries>(summaries);

  const sortedTopics = topics ? [...topics]?.sort((a, b) => a.name.localeCompare(b.name)) : [];

  const fuse = React.useMemo(() => {
    return new Fuse(summaries, {
      keys: [
        "title",
        "author",
        "slug",
        "author_slug",
        "topic",
        "source_type",
        "introduction",
        "conclusion"
      ],
      threshold: 0.3
    });
  }, [summaries]);

  useEffect(() => {
    if (selectedTopic === "Par catégorie") {
      setSelectedTopic(undefined);
    }

    if (selectedSource === "Par source") {
      setSelectedSource(undefined);
    }

    if (selectedStatus === "Par statut") {
      setSelectedStatus(undefined);
    }
  }, [selectedTopic, selectedStatus, selectedSource]);

  useEffect(() => {
    let filteredSummaries = summaries;

    if (selectedTopic) {
      filteredSummaries = filteredSummaries.filter((summary) => summary.topic === selectedTopic);
    }

    if (selectedSource) {
      filteredSummaries = filteredSummaries.filter(
        (summary) => summary.source_type === selectedSource
      );
    }

    const readSummaryIds = userReads?.map((userRead) => userRead.summary_id) ?? [];

    if (selectedStatus === "not_started") {
      filteredSummaries = filteredSummaries.filter(
        (summary) => !readSummaryIds.includes(summary.id)
      );
    } else if (selectedStatus === "completed") {
      filteredSummaries = filteredSummaries.filter((summary) =>
        readSummaryIds.includes(summary.id)
      );
    } else if (selectedStatus === "saved") {
      const savedSummaryIds = userLibrary?.map((library) => library.summary_id) ?? [];
      filteredSummaries = filteredSummaries.filter((summary) =>
        savedSummaryIds.includes(summary.id)
      );
    }

    if (book) {
      const result = fuse.search(book);
      filteredSummaries = result.map((res) => res.item);
    }

    setFilteredSummaries(filteredSummaries);
  }, [
    book,
    fuse,
    selectedSource,
    selectedStatus,
    selectedTopic,
    summaries,
    userLibrary,
    userReads
  ]);

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

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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

          {/* Source */}
          <Select value={selectedSource ?? "Par source"} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-full lg:min-w-[200px]">
              <SelectValue>{sourceToString(selectedSource as Source)}</SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="Par source">Par source</SelectItem>
                <SelectSeparator />
                <SelectLabel>Sources</SelectLabel>
                {sources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {sourceToString(source)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Enregistrés, terminés, etc */}
          <Select value={selectedStatus ?? "Par statut"} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full lg:min-w-[200px]">
              <SelectValue>
                {statusToString(selectedStatus as SummaryStatus) ?? "Par statut"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="Par statut">Par statut</SelectItem>
                <SelectSeparator />
                <SelectLabel>Statuts</SelectLabel>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.value}>
                    {statusToString(status.value)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredSummaries?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredSummaries?.map((summary) => (
            <Link
              key={summary.id}
              href={`/app/summary/${summary.author_slug}/${summary.slug}`}
              className="h-full"
            >
              <BookCover
                title={summary.title}
                author={summary.author}
                category={summary.topic}
                source={summary.source_type}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex h-96 items-center justify-center">
          <TypographyH3AsSpan>Aucun résumé trouvé</TypographyH3AsSpan>
        </div>
      )}
    </div>
  );
};

export default Library;
