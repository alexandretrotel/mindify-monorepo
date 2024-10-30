import { z } from "zod";

export const suggestionsSchema = z.object({
  suggestions: z.array(z.string()).length(4)
});
