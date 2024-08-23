import Statistics from "@/components/features/my-statistics/Statistics";
import H3 from "@/components/typography/h3";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React from "react";

const MyStatisticsPage = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const userId = data?.user?.id as UUID;

  return (
    <main>
      <div className="flex flex-col gap-4">
        <H3>Mon activité</H3>
        <Statistics userId={userId} />
      </div>
    </main>
  );
};

export default MyStatisticsPage;
