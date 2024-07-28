import React from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

const Source = ({ summarySourceUrl }: { summarySourceUrl: string | undefined }) => {
  if (!summarySourceUrl) {
    return null;
  }

  return (
    <Link href={summarySourceUrl} target="_blank" className="text-muted-foreground hover:underline">
      <span className="flex items-center">
        Voir la source
        <ArrowUpRightIcon className="ml-1 h-4 w-4" />
      </span>
    </Link>
  );
};

export default Source;
