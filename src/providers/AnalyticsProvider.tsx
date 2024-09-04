"use client";
import "client-only";

import React from "react";
import Hotjar from "@hotjar/browser";

const siteId = 5123190;
const hotjarVersion = 6;

export default function AnalyticsProvider({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  React.useEffect(() => {
    Hotjar.initialize(siteId, hotjarVersion);
  }, []);

  return <>{children}</>;
}
