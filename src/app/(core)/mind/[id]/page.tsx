import ShareMind from "@/components/features/share-mind/ShareMind";
import ShareMindSkeleton from "@/components/features/share-mind/skeleton/ShareMindSkeleton";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { Metadata } from "next";
import React, { Suspense } from "react";

export async function generateMetadata({ params }: { params: { id: number } }): Promise<Metadata> {
  const { id } = params;

  const supabaseAdmin = createAdminClient();

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

const MindPage = async ({
  params,
  searchParams
}: {
  params: { id: number };
  searchParams: { sharedBy: UUID };
}) => {
  const { id } = params;
  const sharedByUserId = searchParams.sharedBy;

  const supabase = createClient();

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
        />
      </Suspense>
    </div>
  );
};

export default MindPage;
