import { cn } from "@/lib/utils";
import React from "react";

export function Small({
  children,
  className
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <small className={cn("text-sm font-medium leading-none", className)}>{children}</small>;
}
