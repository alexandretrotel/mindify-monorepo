import type { Metadata } from "next";
import React from "react";
import CookiesContent from "@/markdown/CookiesContent.mdx";

export const metadata: Metadata = {
  title: "Politique de cookies | Mindify"
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto -mt-10 max-w-4xl px-4">
      <CookiesContent />
    </div>
  );
}
