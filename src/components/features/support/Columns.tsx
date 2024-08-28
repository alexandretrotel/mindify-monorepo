"use client";
import "client-only";

import { ColumnDef } from "@tanstack/react-table";
import type { Tables, Enums } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter } from "@/utils/string";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const getColumnNameFromId = (id: string): string => {
  switch (id) {
    case "title":
      return "Titre";
    case "created_at":
      return "Date";
    case "description":
      return "Description";
    case "status":
      return "Statut";
    default:
      return id;
  }
};

export const columns: ColumnDef<
  | (Tables<"support_bugs"> & { bug_type: Enums<"bugs"> })
  | (Tables<"support_features"> & {
      feature_type: Enums<"features">;
    })
>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Titre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title: string = row.getValue("title");
      const formattedTitle = capitalizeFirstLetter(title);

      return formattedTitle;
    }
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date: string = row.getValue("created_at");
      const formattedDate = new Date(date).toLocaleDateString("fr-FR");

      return formattedDate;
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Statut
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status: Enums<"support_status"> = row.getValue("status");

      let formattedStatus;
      let variant: "default" | "secondary" | "destructive" | "outline";
      switch (status) {
        case "not_started":
          formattedStatus = "Pas commencé";
          variant = "destructive";
          break;
        case "in_progress":
          formattedStatus = "En cours";
          variant = "secondary";
          break;
        case "finished":
          formattedStatus = "Terminé";
          variant = "secondary";
          break;
        default:
          formattedStatus = status;
          variant = "secondary";
      }

      return <Badge variant={variant}>{formattedStatus}</Badge>;
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description: string = row.getValue("description");
      const formattedDescription = capitalizeFirstLetter(description);

      return formattedDescription;
    }
  }
];
