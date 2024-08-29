"use client";
import "client-only";

import React from "react";
import UserCard from "@/components/global/UserCard";
import type { User } from "@supabase/supabase-js";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import type { UUID } from "crypto";
import { getAvatar } from "@/utils/users";

const itemsPerPage = 8;

const FriendsClient = ({
  friends,
  friendRequestObject
}: {
  friends: User[];
  friendRequestObject?: {
    userId: UUID;
    isConnected: boolean;
    requestedFriends?: User[];
    displayCancelButton: boolean;
    displayRequestButton: boolean;
  };
}) => {
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(0);

  React.useEffect(() => {
    if (friends) {
      setTotalPages(Math.ceil(friends?.length / itemsPerPage));
    }
  }, [friends]);

  if (!friends || friends?.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 text-center text-2xl font-semibold">
        Aucun ami
      </div>
    );
  }

  const paginatedFriends = friends?.slice(
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
        {paginatedFriends?.map((friend, index) => {
          const picture = getAvatar(friend?.user_metadata);
          const friendRequestObjectCard = {
            ...(friendRequestObject as {
              userId: UUID;
              isConnected: boolean;
              requestedFriends?: User[];
              displayCancelButton: boolean;
              displayRequestButton: boolean;
            }),
            friendId: friend?.id as UUID
          };

          return (
            <UserCard
              key={index}
              user={friend}
              userPicture={picture}
              friendRequestObject={friendRequestObjectCard}
            />
          );
        })}
      </div>

      {friends?.length > itemsPerPage && (
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

export default FriendsClient;
