"use client";
import "client-only";

import {
  BookIcon,
  GraduationCapIcon,
  LaptopIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  UserIcon
} from "lucide-react";
import React from "react";
import type { Tables } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import { searchSummaries, searchUsers } from "@/actions/search.action";
import Span from "@/components/typography/span";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandDialog
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const links = [
  { label: "Librairie", href: "/library", enabled: true, icon: <BookIcon className="h-4 w-4" /> },
  {
    label: "Apprendre",
    href: "/learn",
    enabled: true,
    icon: <GraduationCapIcon className="h-4 w-4" />
  },
  {
    label: "Utilisateurs",
    href: "/users",
    enabled: true,
    icon: <GraduationCapIcon className="h-4 w-4" />
  }
];

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
    users: { id: string; name: string; avatar: string }[];
    summaries: (Tables<"summaries"> & { authors: Tables<"authors"> })[];
  }>({
    users: [],
    summaries: []
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { toast } = useToast();
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery) {
        setIsSearching(true);

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
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ users: [], summaries: [] });
      }
    };

    performSearch();
  }, [debouncedSearchQuery, toast]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setIsOpen(false);
    command();
  }, []);

  React.useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  return (
    <div className="flex w-full items-center justify-center">
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12"
        )}
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Rechercher un résumé, un utilisateur, etc...</span>
        <span className="inline-flex lg:hidden">Rechercher...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <VisuallyHidden>
          <DialogTitle>Rechercher</DialogTitle>
          <DialogDescription>Rechercher un résumé, un utilisateur, etc...</DialogDescription>
        </VisuallyHidden>
        <CommandInput
          placeholder="Rechercher un résumé, un utilisateur, etc..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />

        <CommandList>
          {isSearching ? (
            <div className="flex h-16 w-full items-center justify-center">
              <Span size="sm">Recherche en cours...</Span>
            </div>
          ) : (
            <React.Fragment>
              <CommandGroup heading="Navigation">
                {links?.map((link) => {
                  if (!link.enabled) return null;

                  return (
                    <CommandItem
                      key={link.label}
                      onSelect={() => runCommand(() => router.push(link.href))}
                      className="!pointer-events-auto flex !cursor-pointer items-center gap-2 !opacity-100"
                    >
                      {link.icon}
                      <Span size="sm">{link.label}</Span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {searchResults?.users?.length === 0 && searchResults?.summaries?.length === 0 ? (
                <CommandEmpty>Aucun résultat</CommandEmpty>
              ) : (
                <React.Fragment>
                  {searchResults?.users?.length > 0 && (
                    <CommandGroup heading="Utilisateurs">
                      {searchResults?.users?.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.name}
                          onSelect={() => runCommand(() => router.push(`/profile/${user.id}`))}
                          className="!pointer-events-auto flex !cursor-pointer items-center gap-2 !opacity-100"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              <UserIcon className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <Span size="sm">{user.name}</Span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {searchResults?.summaries?.length > 0 && (
                    <React.Fragment>
                      <CommandSeparator />
                      <CommandGroup heading="Résumés">
                        {searchResults?.summaries?.map((summary) => (
                          <CommandItem
                            key={summary.id}
                            value={summary.title}
                            onSelect={() =>
                              runCommand(() =>
                                router.push(`/summary/${summary.authors.slug}/${summary.slug}`)
                              )
                            }
                            className="!pointer-events-auto flex !cursor-pointer items-center gap-2 !opacity-100"
                          >
                            <BookIcon className="h-4 w-4" />
                            <Span size="sm">{summary.title}</Span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}

              <CommandSeparator />
              <CommandGroup heading="Apparence">
                <CommandItem
                  onSelect={() => runCommand(() => setTheme("light"))}
                  className="!pointer-events-auto !cursor-pointer !opacity-100"
                >
                  <SunIcon className="mr-2 h-4 w-4" />
                  Clair
                </CommandItem>
                <CommandItem
                  onSelect={() => runCommand(() => setTheme("dark"))}
                  className="!pointer-events-auto !cursor-pointer !opacity-100"
                >
                  <MoonIcon className="mr-2 h-4 w-4" />
                  Sombre
                </CommandItem>
                <CommandItem
                  onSelect={() => runCommand(() => setTheme("system"))}
                  className="!pointer-events-auto !cursor-pointer !opacity-100"
                >
                  <LaptopIcon className="mr-2 h-4 w-4" />
                  Système
                </CommandItem>
              </CommandGroup>
            </React.Fragment>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
