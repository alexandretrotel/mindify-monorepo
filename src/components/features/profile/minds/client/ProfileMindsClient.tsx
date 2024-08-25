"use client";
import "client-only";

import Mind from "@/components/global/Mind";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import type { Tables } from "@/types/supabase";
import type { UUID } from "crypto";
import React from "react";

const itemsPerPage = 4;

const ProfileMindsClient = ({
  minds,
  initialAreSaved,
  userId,
  isConnected,
  userName
}: {
  minds: (Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  })[];
  initialAreSaved: boolean[];
  userId: UUID;
  isConnected: boolean;
  userName: string;
}) => {
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(0);

  React.useEffect(() => {
    if (minds) {
      setTotalPages(Math.ceil(minds?.length / itemsPerPage));
    }
  }, [minds]);

  const paginatedMinds = minds?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {paginatedMinds?.map((mind, index) => {
          return (
            <Mind
              key={mind.id}
              mind={mind}
              initialIsSaved={initialAreSaved[index]}
              userId={userId}
              isConnected={isConnected}
              userName={userName}
            />
          );
        })}
      </div>

      {minds?.length > itemsPerPage && (
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

export default ProfileMindsClient;
