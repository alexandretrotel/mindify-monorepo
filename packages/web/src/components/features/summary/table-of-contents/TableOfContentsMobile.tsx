import React from "react";
import Link from "next/link";
import type { Tables } from "@/types/supabase";
import H2 from "@/components/typography/h2";

const TableOfContentsMobile = async ({ chapters }: { chapters: Tables<"chapters"> }) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-4">
        <H2>Table des matières</H2>
      </div>

      <ul className="flex flex-col gap-2 text-lg">
        {chapters?.titles?.map((title, index) => (
          <li key={title}>
            <Link href={"#chapter" + String(index + 1)} className="text-primary hover:underline">
              {index + 1}. {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContentsMobile;
