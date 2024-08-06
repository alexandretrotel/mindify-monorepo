import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import BookCoverSkeleton from "@/components/global/skeleton/BookCoverSkeleton";

const itemsPerPage = 8;
const totalPages = 1;
const currentPage = 1;

const SummariesByCategorySkeleton = async () => {
  return (
    <>
      <div className="min-w-md relative max-w-md flex-1">
        <SearchIcon className="absolute left-2 top-3 flex h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Titre, auteur, mots-clés, etc..."
          className="w-full rounded-lg bg-background pl-8"
          disabled
        />
      </div>

      {/* Summaries */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <BookCoverSkeleton key={index} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="flex items-center gap-2">
        <button disabled>
          <PaginationPrevious>
            <PaginationLink>Précédent</PaginationLink>
          </PaginationPrevious>
        </button>

        <PaginationContent>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <button disabled>
                <PaginationLink isActive={currentPage === index + 1}>{index + 1}</PaginationLink>
              </button>
            </PaginationItem>
          ))}
        </PaginationContent>

        <button disabled>
          <PaginationNext>
            <PaginationLink>Suivant</PaginationLink>
          </PaginationNext>
        </button>
      </Pagination>
    </>
  );
};

export default SummariesByCategorySkeleton;
