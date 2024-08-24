"use client";
import "client-only";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React, { useEffect } from "react";
import BookCover from "@/components/global/BookCover";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import type { Tables } from "@/types/supabase";

const itemsPerPage = 8;

const SummariesByCategoryClient = ({
  topic,
  summariesByTopic
}: {
  topic: Tables<"topics">;
  summariesByTopic: (Tables<"summaries"> & { author_slug: string } & {
    authors: Tables<"authors">;
  })[];
}) => {
  const [summarySearch, setSummarySearch] = React.useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(0);

  useEffect(() => {
    if (summariesByTopic) {
      setTotalPages(Math.ceil(summariesByTopic?.length / itemsPerPage));
    }
  }, [summariesByTopic]);

  const paginatedSummaries = summariesByTopic?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <React.Fragment>
      <div className="min-w-md relative max-w-md flex-1">
        <SearchIcon className="absolute left-2 top-3 flex h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Titre, auteur, mots-clés, etc..."
          className="w-full rounded-lg bg-background pl-8"
          value={summarySearch ?? ""}
          onChange={(e) => setSummarySearch(e.target.value)}
        />
      </div>

      {/* Summaries */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {paginatedSummaries?.map((summary) => (
          <Link key={summary.id} href={`/summary/${summary.author_slug}/${summary.slug}`}>
            <BookCover
              title={summary.title}
              author={summary?.authors?.name}
              category={topic.name}
              source={summary.source_type}
              image={summary.image_url ?? undefined}
            />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="flex items-center gap-2">
        <button onClick={handlePreviousPage}>
          <PaginationPrevious>
            <PaginationLink>Précédent</PaginationLink>
          </PaginationPrevious>
        </button>

        <PaginationContent>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <button onClick={() => setCurrentPage(index + 1)}>
                <PaginationLink isActive={currentPage === index + 1}>{index + 1}</PaginationLink>
              </button>
            </PaginationItem>
          ))}
        </PaginationContent>

        <button onClick={handleNextPage}>
          <PaginationNext>
            <PaginationLink>Suivant</PaginationLink>
          </PaginationNext>
        </button>
      </Pagination>
    </React.Fragment>
  );
};

export default SummariesByCategoryClient;
