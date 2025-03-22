import { cn } from "@/lib/utils";
import React from "react";

export function InlineCode({
  children,
  clasName
}: Readonly<{ children: React.ReactNode; clasName?: string }>) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        clasName
      )}
    >
      {children}
    </code>
  );
}
