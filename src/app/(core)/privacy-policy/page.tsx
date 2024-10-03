import type { Metadata } from "next";
import React from "react";
import PrivacyContent from "@/markdown/PrivacyContent.mdx";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Mindify"
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto -mt-10 max-w-4xl px-4">
      <PrivacyContent />
    </div>
  );
}
