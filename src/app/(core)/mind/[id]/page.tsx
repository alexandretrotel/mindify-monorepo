import ShareMind from "@/components/features/share-mind/ShareMind";
import ShareMindSkeleton from "@/components/features/share-mind/skeleton/ShareMindSkeleton";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { Metadata } from "next";
import React, { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ id: number }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;

  const { data: mind } = await supabaseAdmin
    .from("minds")
    .select("*, summaries(*, authors(*))")
    .eq("id", id)
    .maybeSingle();

  let title;
  if (mind?.summaries?.source_type === "book") {
    title = `${mind?.summaries?.title} - ${mind?.summaries?.authors?.name} | Mindify`;
  } else {
    title = `${mind?.summaries?.title} | Mindify`;
  }

  return {
    title,
    openGraph: {
      title: `${mind?.summaries?.title} | Mindify`,
      description: mind?.text,
      images: [
        {
          url: mind?.summaries?.image_url ?? "/open-graph/og-image.png"
        }
      ],
      siteName: "Mindify",
      url: `https://mindify.fr/mind/${id}`
    },
    twitter: {
      title: `${mind?.summaries?.title} | Mindify`,
      card: "summary_large_image",
      description: mind?.text,
      images: [
        {
          url: mind?.summaries?.image_url ?? "/open-graph/og-image.png"
        }
      ]
    }
  };
}

const MindPage = async (props: {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ sharedBy: UUID }>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { id } = params;
  const sharedByUserId = searchParams.sharedBy;

  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;

  const isConnected = !!userId;

  return (
    <div className="mx-auto max-w-xl">
      <Suspense fallback={<ShareMindSkeleton />}>
        <ShareMind
          mindId={id}
          isConnected={isConnected}
          sharedByUserId={sharedByUserId}
          userId={userId}
          userName={user?.user_metadata?.name as string}
        />
      </Suspense>
    </div>
  );
};

export default MindPage;
