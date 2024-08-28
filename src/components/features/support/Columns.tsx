"use client";
import "client-only";

import { ColumnDef } from "@tanstack/react-table";
import type { Tables, Enums } from "@/types/supabase";

export const columns: ColumnDef<
  | (Tables<"support_bugs"> & { bug_type: Enums<"bugs"> })
  | (Tables<"support_features"> & {
      feature_type: Enums<"features">;
    })
>[] = [
  {
    accessorKey: "title",
    header: "Titre"
  },
  {
    accessorKey: "status",
    header: "Statut"
  },
  {
    accessorKey: "type",
    header: "Type"
  },
  {
    accessorKey: "description",
    header: "Description"
  },
  {
    accessorKey: "created_at",
    header: "Date"
  }
];
