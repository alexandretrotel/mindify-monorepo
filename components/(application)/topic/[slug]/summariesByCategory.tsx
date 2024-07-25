"use client";
import "client-only";

import { Input } from "@/components/ui/input";
import type { Topic } from "@/types/topics/topics";
import { SearchIcon } from "lucide-react";
import React, { useEffect } from "react";
import BookCover from "@/components/global/bookCover";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import type { Summaries } from "@/types/summary/summary";

const itemsPerPage = 8;

const SummariesByCategory = ({ topic, summaries }: { topic: Topic; summaries: Summaries }) => {
  const [summarySearch, setSummarySearch] = React.useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(0);

  useEffect(() => {
    if (summaries) {
      setTotalPages(Math.ceil(summaries?.length / itemsPerPage));
    }
  }, [summaries]);

  const paginatedSummaries = summaries?.slice(
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
    <>
      <div className="min-w-md relative max-w-md flex-1">
        <SearchIcon className="absolute left-2 top-3 flex h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Titre, auteur, etc..."
          className="w-full rounded-lg bg-background pl-8"
          value={summarySearch ?? ""}
          onChange={(e) => setSummarySearch(e.target.value)}
        />
      </div>

      {/* Summaries */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {paginatedSummaries?.map((summary, index) => (
          <Link href={`/summary/${summary.author_slug}/${summary.slug}`} key={index}>
            <BookCover
              title={summary.title}
              author={summary.author}
              category={topic.name}
              source={summary.source_type}
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
    </>
  );
};

export default SummariesByCategory;
