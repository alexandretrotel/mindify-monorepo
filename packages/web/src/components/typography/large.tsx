import { cn } from "@/lib/utils";
import React from "react";

export function Large({
  children,
  className
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <div className={cn("text-lg font-semibold", className)}>{children}</div>;
}
