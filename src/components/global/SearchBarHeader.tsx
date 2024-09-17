"use client";
import "client-only";

import { BookIcon, SearchIcon } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { Tables } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import { searchSummaries, searchUsers } from "@/actions/search.action";
import Link from "next/link";
import Span from "@/components/typography/span";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchBarHeader() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<{
    users: { id: string; name: string; email: string; avatar: string }[];
    summaries: (Tables<"summaries"> & { authors: Tables<"authors"> })[];
  }>({
    users: [],
    summaries: []
  });
  const [isOpen, setIsOpen] = React.useState(false);

  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery) {
        try {
          const [users, summaries] = await Promise.all([
            searchUsers(debouncedSearchQuery),
            searchSummaries(debouncedSearchQuery)
          ]);

          setSearchResults({ users, summaries });
          setIsOpen(true);
        } catch (error) {
          console.error(error);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la recherche",
            variant: "destructive"
          });
        }
      } else {
        setSearchResults({ users: [], summaries: [] });
        setIsOpen(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery, toast]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !(searchRef.current as HTMLElement).contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const runCommand = React.useCallback((command: () => unknown) => {
    setIsOpen(false);
    command();
  }, []);

  return (
    <div className="flex w-full items-center justify-center" ref={searchRef}>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div className="relative w-full md:max-w-[400px] lg:max-w-[500px]">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un résumé, un utilisateur, un auteur, etc..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={inputRef}
            />
          </div>
        </DialogTrigger>

        <DialogContent className="w-[400px] max-w-xs p-0 md:max-w-lg">
          <Command>
            <CommandInput
              placeholder="Rechercher un résumé, un utilisateur, etc..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {searchResults.users.length === 0 && searchResults.summaries.length === 0 ? (
                <CommandEmpty>Aucun résultat</CommandEmpty>
              ) : (
                <React.Fragment>
                  {searchResults.users.length > 0 && (
                    <CommandGroup heading="Utilisateurs">
                      {searchResults.users.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => runCommand(() => router.push(`/profile/${user.id}`))}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <Span size="sm">{user.name}</Span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {searchResults.summaries.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup heading="Résumés">
                        {searchResults.summaries.map((summary) => (
                          <CommandItem
                            key={summary.id}
                            onSelect={() =>
                              runCommand(() =>
                                router.push(`/summary/${summary.authors.slug}/${summary.slug}`)
                              )
                            }
                            className="flex items-center gap-2"
                          >
                            <BookIcon className="h-4 w-4" />
                            <Span size="sm">{summary.title}</Span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </React.Fragment>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
