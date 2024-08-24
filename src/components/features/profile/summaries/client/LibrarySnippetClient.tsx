"use client";
import "client-only";

import React from "react";
import type { Tables } from "@/types/supabase";
import Link from "next/link";
import BookCover from "@/components/global/BookCover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

const itemsPerPage = 8;

const LibrarySnippetClient = ({
  summaries
}: {
  summaries: (Tables<"summaries"> & {
    authors: Tables<"authors">;
    topics: Tables<"topics">;
    author_slug: string;
    topic: string;
    image_url: string;
  })[];
}) => {
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(0);

  React.useEffect(() => {
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
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {paginatedSummaries?.map((summary) => {
          return (
            <Link
              key={summary.id}
              href={`/summary/${summary.author_slug}/${summary.slug}`}
              className="h-full"
            >
              <BookCover
                title={summary.title}
                author={summary.authors.name}
                category={summary.topic}
                source={summary.source_type}
                image={summary.image_url}
              />
            </Link>
          );
        })}
      </div>

      {summaries?.length > itemsPerPage && (
        <Pagination className="flex items-center gap-2">
          <button onClick={handlePreviousPage}>
            <PaginationPrevious>
              <PaginationLink>Précédent</PaginationLink>
            </PaginationPrevious>
          </button>

          <PaginationContent>
            {Array.from({ length: totalPages }).map((_, index) => {
              const isStart = index < 3;
              const isEnd = index >= totalPages - 1;
              const isCurrent = currentPage === index + 1;

              if (isStart || isEnd || isCurrent) {
                return (
                  <PaginationItem key={index}>
                    <button onClick={() => setCurrentPage(index + 1)}>
                      <PaginationLink isActive={isCurrent}>{index + 1}</PaginationLink>
                    </button>
                  </PaginationItem>
                );
              }

              if (index === 3) {
                return (
                  <span key={index} className="mx-1">
                    ...
                  </span>
                );
              }

              return null;
            })}
          </PaginationContent>

          <button onClick={handleNextPage}>
            <PaginationNext>
              <PaginationLink>Suivant</PaginationLink>
            </PaginationNext>
          </button>
        </Pagination>
      )}
    </div>
  );
};

export default LibrarySnippetClient;
