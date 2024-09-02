import Validate from "@/components/features/admin/Validate";
import H3Span from "@/components/typography/h3AsSpan";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React from "react";

const ValidatePage = async () => {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as UUID;

  const { data: adminsData, error: adminsError } = await supabase.from("admins").select("*");

  if (adminsError) {
    console.error("Error while fetching admins", adminsError);
    throw new Error("Error while fetching admins");
  }

  const isAdmin = adminsData?.find((admin) => admin?.user_id === userId);

  if (!isAdmin) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("summary_requests")
    .select("*")
    .eq("validated", false);

  if (error) {
    console.error("Error while fetching summary requests", error);
    throw new Error("Error while fetching summary requests");
  }

  const summaryRequests = data;

  if (summaryRequests.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <H3Span>Aucune demande de résumé</H3Span>
      </div>
    );
  }

  // tinder with two buttons
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4 px-4">
      <Validate summaryRequests={summaryRequests} />
    </div>
  );
};

export default ValidatePage;
