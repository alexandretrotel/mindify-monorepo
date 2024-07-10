import React from "react";

export default function TypographySemibold({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className="font-semibold">{children}</span>;
}
