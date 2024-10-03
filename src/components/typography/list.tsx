import { cn } from "@/lib/utils";
import React from "react";

interface ListProps {
  items: string[];
  className?: string;
}

export function List({ items, className }: ListProps) {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>
      {items?.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  );
}
