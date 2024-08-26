"use client";
import "client-only";

import UserCard from "@/components/global/UserCard";
import H3Span from "@/components/typography/h3AsSpan";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import type { User } from "@supabase/supabase-js";
import React from "react";
import Fuse from "fuse.js";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAvatar } from "@/utils/users";

const itemsPerPage = 8;

const UsersListClient = ({ usersArray }: { usersArray: User[] }) => {
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [user, setUser] = React.useState<string | undefined>(undefined);
  const [filteredUsers, setFilteredUsers] = React.useState<User[] | null>(null);

  const fuse = React.useMemo(() => {
    return new Fuse(usersArray, {
      keys: ["email", "full_name", "name", "username", "id"],
      threshold: 0.3
    });
  }, [usersArray]);

  React.useEffect(() => {
    let filteredUsers = usersArray;

    if (user) {
      filteredUsers = fuse.search(user).map((result) => result.item);
    }

    setFilteredUsers(filteredUsers);
  }, [fuse, user, usersArray]);

  React.useEffect(() => {
    if (usersArray) {
      setTotalPages(Math.ceil(usersArray?.length / itemsPerPage));
    }
  }, [usersArray]);

  const paginatedUsers = filteredUsers?.slice(
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
      <H3Span>Les membres de la communauté</H3Span>

      <div className="min-w-md relative max-w-md flex-1">
        <SearchIcon className="absolute left-2 top-3 flex h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un utilisateur"
          className="w-full rounded-lg bg-background pl-8"
          value={user ?? ""}
          onChange={(e) => setUser(e.target.value)}
        />
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {paginatedUsers?.map((user) => {
          const userPicture = getAvatar(user?.user_metadata);

          return (
            <li key={user.id}>
              <UserCard user={user} userPicture={userPicture} />
            </li>
          );
        })}
      </ul>

      {(filteredUsers?.length as number) > itemsPerPage && (
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

export default UsersListClient;
