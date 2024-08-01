import React from "react";

export function Large({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="text-lg font-semibold">{children}</div>;
}
