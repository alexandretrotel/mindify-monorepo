import React from "react";

export function Lead({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="text-xl text-muted-foreground">{children}</p>;
}
