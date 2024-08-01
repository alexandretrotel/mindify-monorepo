import React from "react";

export default function Semibold({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className="font-semibold">{children}</span>;
}
