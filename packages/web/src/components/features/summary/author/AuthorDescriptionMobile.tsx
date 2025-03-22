import React from "react";
import H2 from "@/components/typography/h2";
import Span from "@/components/typography/span";
import type { Tables } from "@/types/supabase";

const AuthorDescriptionMobile = async ({ author }: { author: Tables<"authors"> }) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <H2>À propos de l&apos;auteur</H2>
      <Span size="lg">{author?.description ?? "Aucune description disponible."}</Span>
    </div>
  );
};

export default AuthorDescriptionMobile;
