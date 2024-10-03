import { cn } from "@/lib/utils";
import React from "react";

export function Lead({
  children,
  className
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <p className={cn("text-xl text-muted-foreground", className)}>{children}</p>;
}
