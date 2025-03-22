import type { SummaryStatus } from "@/types/summary";

export const statusToString = (status: SummaryStatus): string => {
  switch (status) {
    case "completed":
      return "Terminé";
    case "saved":
      return "Enregistré";
    case "not_started":
      return "Pas commencé";
    default:
      return "Par statut";
  }
};
