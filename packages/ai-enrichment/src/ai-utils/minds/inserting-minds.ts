import { supabaseAdmin } from "@/utils/supabase";

export async function insertingMinds(
  mindsObject: { minds: string; questions: string }[],
  summaryId: number | undefined
) {
  if (!summaryId) {
    throw new Error("Summary ID is required");
  }

  if (mindsObject) {
    for (const elt of mindsObject) {
      try {
        const { error: mindsError } = await supabaseAdmin.from("minds").insert({
          text: elt.minds,
          summary_id: summaryId,
          question: elt.questions,
          mindify_ai: true,
        });

        if (mindsError) {
          throw mindsError;
        }
      } catch (error) {
        console.error("Error while generating mind", error);
        console.log("\n");
        continue;
      }
    }
  }
}
