import React from "react";

export function Small({ children }: Readonly<{ children: React.ReactNode }>) {
  return <small className="text-sm font-medium leading-none">{children}</small>;
}
