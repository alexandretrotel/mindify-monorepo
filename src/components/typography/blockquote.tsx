import { cn } from "@/lib/utils";
import React from "react";

export function Blockquote({
  children,
  className
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>{children}</blockquote>
  );
}
