import type { Metadata } from "next";
import React from "react";
import TermsOfServiceContent from "@/markdown/TermsOfServiceContent.mdx";

export const metadata: Metadata = {
  title: "Conditions d'utilisations | Mindify"
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto max-w-4xl px-4">
      <TermsOfServiceContent />
    </div>
  );
}
