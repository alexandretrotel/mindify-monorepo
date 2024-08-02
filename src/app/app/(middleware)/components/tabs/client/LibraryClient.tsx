"use client";
import "client-only";

import React, { useEffect } from "react";
import H3 from "@/components/typography/h3";
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
import BookCover from "@/components/global/BookCover";
import Link from "next/link";
import type { SummaryStatusesWithValue, SummaryStatus } from "@/types/summary";
import { getTopicNameFromTopicSlug, sourceToString } from "@/utils/topics";
import H3Span from "@/components/typography/h3AsSpan";
import { statusToString } from "@/utils/summary";
import Fuse from "fuse.js";
import type { Enums, Tables } from "@/types/supabase";

const statuses: SummaryStatusesWithValue = [
  { id: 1, name: "Pas commencé", value: "not_started" },
  { id: 2, name: "Enregistré", value: "saved" },
  { id: 3, name: "Terminé", value: "completed" }
] as SummaryStatusesWithValue;

const sources = ["book", "article", "podcast", "video"] as Enums<"source">[];

const LibraryClient = ({
  summaries,
  topics,
  userReads,
  userLibrary,
  initialSearch,
  initialTopic,
  initialSource,
  initialStatus
}: {
  summaries: (Tables<"summaries"> & { topic: string; author_slug: string } & {
    authors: Tables<"authors">;
    topics: Tables<"topics">;
  })[];
  topics: Tables<"topics">[];
  userReads: Tables<"read_summaries">[];
  userLibrary: Tables<"saved_summaries">[];
  initialSearch: string | undefined;
  initialTopic: string | undefined;
  initialSource: Enums<"source"> | undefined;
  initialStatus: SummaryStatus | undefined;
}) => {
  const [book, setBook] = React.useState<string | undefined>(initialSearch);
  const [selectedTopic, setSelectedTopic] = React.useState<string | undefined>(
    getTopicNameFromTopicSlug(topics, initialTopic as string)
  );
  const [selectedSource, setSelectedSource] = React.useState<string | undefined>(initialSource);
  const [selectedStatus, setSelectedStatus] = React.useState<string | undefined>(initialStatus);
  const [filteredSummaries, setFilteredSummaries] = React.useState<
    (Tables<"summaries"> & { topic: string; author_slug: string } & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    })[]
  >(summaries);

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
      filteredSummaries = filteredSummaries.filter((summary) => summary?.topic === selectedTopic);
    }

    if (selectedSource) {
      filteredSummaries = filteredSummaries.filter(
        (summary) => summary?.source_type === selectedSource
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
      <H3>Librairie</H3>

      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <div className="min-w-md relative max-w-md flex-1">
          <SearchIcon className="absolute left-2 top-3 flex h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Titre, auteur, mots-clés, etc..."
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
              <SelectValue>{sourceToString(selectedSource as Enums<"source">)}</SelectValue>
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
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredSummaries?.map((summary) => (
            <Link key={summary.id} href={`/app/summary/${summary?.author_slug}/${summary.slug}`}>
              <BookCover
                title={summary.title}
                author={summary?.authors?.name}
                category={summary?.topic}
                source={summary.source_type}
                image={summary?.image_url ?? undefined}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center">
          <H3Span>Aucun résumé trouvé</H3Span>
        </div>
      )}
    </div>
  );
};

export default LibraryClient;
