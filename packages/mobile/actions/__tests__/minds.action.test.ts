import { supabase } from "@/lib/supabase";
import {
  getAllMinds,
  saveMind,
  unsaveMind,
  likeMind,
  unlikeMind,
  areMindsSaved,
  areMindsLiked,
  getMindsBySummaryId,
  getSavedMindCount,
  getLikedMindCount,
  isMindSaved,
  isMindLiked,
} from "@/actions/minds.action";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn(),
    in: jest.fn().mockReturnThis(),
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("Minds Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllMinds", () => {
    it("should fetch all minds along with their associated summaries, authors, and topics", async () => {
      const mockMinds = [
        {
          id: 1,
          content: "Mind 1",
          production: true,
          summaries: {
            id: 1,
            title: "Summary 1",
            authors: {
              id: 1,
              name: "Author 1",
            },
            topics: {
              id: 1,
              name: "Topic 1",
            },
          },
        },
        {
          id: 2,
          content: "Mind 2",
          production: true,
          summaries: {
            id: 2,
            title: "Summary 2",
            authors: {
              id: 2,
              name: "Author 2",
            },
            topics: {
              id: 2,
              name: "Topic 2",
            },
          },
        },
        {
          id: 3,
          content: "Mind 3",
          production: false,
          summaries: {
            id: 3,
            title: "Summary 3",
            authors: {
              id: 3,
              name: "Author 3",
            },
            topics: {
              id: 3,
              name: "Topic 3",
            },
          },
        },
      ];

      (
        supabase
          .from("minds")
          .select("*, summaries(title, production, authors(name), topics(name))").match as jest.Mock
      ).mockReturnValueOnce({
        data: mockMinds?.filter((mind) => mind.production),
      });

      const minds = await getAllMinds();

      expect(
        supabase.from("minds").select("*, summaries(*, authors(*), topics(*))").match,
      ).toHaveBeenCalledWith({
        production: true,
        "summaries.production": true,
        "summaries.authors.production": true,
        "summaries.topics.production": true,
      });
      expect(minds).toEqual(mockMinds?.filter((mind) => mind.production));
    });

    it("should throw an error if the fetch operation fails", async () => {
      const error = new Error("An error occurred");
      (
        supabase.from("minds").select("*, summaries(*, authors(*), topics(*))").match as jest.Mock
      ).mockReturnValueOnce({
        error,
      });

      await expect(getAllMinds()).rejects.toThrow(
        "Une erreur est survenue lors de la récupération des citations",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("saveMind", () => {
    it("should save a mind for a user", async () => {
      const mindId = 1;
      const userId = "user1";

      (supabase.from("saved_minds").insert as jest.Mock).mockReturnValueOnce({
        error: null,
      });
      const message = await saveMind(mindId, userId);

      expect(supabase.from).toHaveBeenCalledWith("saved_minds");
      expect(supabase.from("saved_minds").insert).toHaveBeenCalledWith({
        user_id: userId,
        mind_id: mindId,
      });
      expect(message).toEqual({ message: "Le mind a été sauvegardé avec succès." });
    });

    it("should throw an error if the save operation fails", async () => {
      const mindId = 1;
      const userId = "user1";
      const error = new Error("An error occurred");

      (supabase.from("saved_minds").insert as jest.Mock).mockReturnValueOnce({
        error,
      });

      await expect(saveMind(mindId, userId)).rejects.toThrow("Impossible de sauvegarder le mind.");

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("unsaveMind", () => {
    it("should unsave a mind for a user", async () => {
      const mindId = 1;
      const userId = "user1";

      (supabase.from("saved_minds").delete().match as jest.Mock).mockReturnValueOnce({
        mind_id: mindId,
        user_id: userId,
      });

      const message = await unsaveMind(mindId, userId);

      expect(supabase.from).toHaveBeenCalledWith("saved_minds");
      expect(supabase.from("saved_minds").delete).toHaveBeenCalledWith();
      expect(supabase.from("saved_minds").delete().match).toHaveBeenCalledWith({
        mind_id: mindId,
        user_id: userId,
      });
      expect(message).toEqual({ message: "Le mind a été retiré avec succès." });
    });

    it("should throw an error if the unsave operation fails", async () => {
      const mindId = 1;
      const userId = "user1";
      const error = new Error("An error occurred");

      (supabase.from("saved_minds").delete().match as jest.Mock).mockReturnValueOnce({
        error,
      });

      await expect(unsaveMind(mindId, userId)).rejects.toThrow("Impossible de retirer le mind.");

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("likeMind", () => {
    it("should like a mind for a user", async () => {
      const mindId = 1;
      const userId = "user1";

      (supabase.from("liked_minds").insert as jest.Mock).mockReturnValueOnce({
        error: null,
      });

      const message = await likeMind(mindId, userId);

      expect(supabase.from).toHaveBeenCalledWith("liked_minds");
      expect(supabase.from("liked_minds").insert).toHaveBeenCalledWith({
        user_id: userId,
        mind_id: mindId,
      });
      expect(message).toEqual({ message: "Le mind a été liké avec succès." });
    });

    it("should throw an error if the like operation fails", async () => {
      const mindId = 1;
      const userId = "user1";
      const error = new Error("An error occurred");

      (supabase.from("liked_minds").insert as jest.Mock).mockReturnValueOnce({
        error,
      });

      await expect(likeMind(mindId, userId)).rejects.toThrow("Impossible de liker le mind.");

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("unlikeMind", () => {
    it("should unlike a mind for a user", async () => {
      const mindId = 1;
      const userId = "user1";

      (supabase.from("liked_minds").delete().match as jest.Mock).mockReturnValueOnce({
        mind_id: mindId,
        user_id: userId,
      });

      const message = await unlikeMind(mindId, userId);

      expect(supabase.from).toHaveBeenCalledWith("liked_minds");
      expect(supabase.from("liked_minds").delete).toHaveBeenCalledWith();
      expect(supabase.from("liked_minds").delete().match).toHaveBeenCalledWith({
        mind_id: mindId,
        user_id: userId,
      });
      expect(message).toEqual({ message: "Le like du mind a été retiré avec succès." });
    });

    it("should throw an error if the unlike operation fails", async () => {
      const mindId = 1;
      const userId = "user1";
      const error = new Error("An error occurred");

      (supabase.from("liked_minds").delete().match as jest.Mock).mockReturnValueOnce({
        error,
      });

      await expect(unlikeMind(mindId, userId)).rejects.toThrow(
        "Impossible de retirer le like du mind.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("areMindsSaved", () => {
    it("should return whether the minds are saved for the user's ID", async () => {
      const mindIds = [1, 2, 3, 4, 5];
      const userId = "user1";

      (
        supabase.from("saved_minds").select("mind_id").eq("user_id", userId).in as jest.Mock
      ).mockReturnValueOnce({
        data: [{ mind_id: 1 }, { mind_id: 3 }],
      });

      const savedMinds = await areMindsSaved(mindIds, userId);

      expect(supabase.from).toHaveBeenCalledWith("saved_minds");
      expect(supabase.from("saved_minds").select).toHaveBeenCalledWith("mind_id");
      expect(supabase.from("saved_minds").select("mind_id").eq).toHaveBeenCalledWith(
        "user_id",
        userId,
      );
      expect(
        supabase.from("saved_minds").select("mind_id").eq("user_id", userId).in,
      ).toHaveBeenCalledWith("mind_id", mindIds);
      expect(savedMinds).toEqual([true, false, true, false, false]);
    });
  });

  describe("areMindsLiked", () => {
    it("should return whether the minds are liked for the user's ID", async () => {
      const mindIds = [1, 2, 3, 4, 5];
      const userId = "user1";

      (
        supabase.from("liked_minds").select("mind_id").eq("user_id", userId).in as jest.Mock
      ).mockReturnValueOnce({
        data: [{ mind_id: 2 }, { mind_id: 4 }],
      });

      const likedMinds = await areMindsLiked(mindIds, userId);

      expect(supabase.from("liked_minds").select("mind_id").eq).toHaveBeenCalledWith(
        "user_id",
        userId,
      );
      expect(
        supabase.from("liked_minds").select("mind_id").eq("user_id", userId).in,
      ).toHaveBeenCalledWith("mind_id", mindIds);
      expect(likedMinds).toEqual([false, true, false, true, false]);
    });

    it("should throw an error if the check operation fails", async () => {
      const mindIds = [1, 2, 3, 4, 5];
      const userId = "user1";
      const error = new Error("An error occurred");

      (
        supabase.from("liked_minds").select("mind_id").eq("user_id", userId).in as jest.Mock
      ).mockReturnValueOnce({
        error,
      });

      await expect(areMindsLiked(mindIds, userId)).rejects.toThrow(
        "Impossible de vérifier si les minds sont sauvegardés.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getMindsBySummaryId", () => {
    it("should fetch minds associated with a specific summary ID along with their associated summaries and authors", async () => {
      const summaryId = 1;
      const mockMinds = [
        {
          id: 1,
          content: "Mind 1",
          production: true,
          summaries: [
            {
              id: 1,
              title: "Summary 1",
              authors: [
                {
                  id: 1,
                  name: "Author 1",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          content: "Mind 2",
          production: true,
          summaries: [
            {
              id: 1,
              title: "Summary 1",
              authors: [
                {
                  id: 1,
                  name: "Author 1",
                },
              ],
            },
          ],
        },
        {
          id: 3,
          content: "Mind 3",
          production: false,
          summaries: [
            {
              id: 2,
              title: "Summary 2",
              authors: [
                {
                  id: 2,
                  name: "Author 2",
                },
              ],
            },
          ],
        },
      ];

      (
        supabase.from("minds").select("*, summaries(title, authors(name))").match as jest.Mock
      ).mockReturnValueOnce({
        data: mockMinds?.filter((mind) => mind.production),
      });

      const minds = await getMindsBySummaryId(summaryId);

      expect(supabase.from).toHaveBeenCalledWith("minds");
      expect(
        supabase.from("minds").select("*, summaries(title, authors(name))").match,
      ).toHaveBeenCalledWith({
        summary_id: summaryId,
        production: true,
      });
      expect(minds).toEqual(mockMinds?.filter((mind) => mind.production));
    });

    it("should throw an error if the fetch operation fails", async () => {
      const summaryId = 1;
      const error = new Error("An error occurred");

      (
        supabase.from("minds").select("*, summaries(title, authors(name))").match as jest.Mock
      ).mockReturnValueOnce({
        error,
      });

      await expect(getMindsBySummaryId(summaryId)).rejects.toThrow(
        "Une erreur est survenue lors de la récupération des citations",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getSavedMindCount", () => {
    it("should get the count of how many times a mind has been saved for the mind's ID", async () => {
      const mindId = 1;

      (
        supabase.from("saved_minds").select("mind_id", {
          count: "exact",
          head: true,
        }).match as jest.Mock
      ).mockReturnValueOnce({
        count: 5,
      });

      const count = await getSavedMindCount(mindId);

      expect(
        supabase.from("saved_minds").select("mind_id, minds(production)", {
          count: "exact",
          head: true,
        }).match,
      ).toHaveBeenCalledWith({ mind_id: mindId, "minds.production": true });
      expect(count).toEqual(5);
    });

    it("should throw an error if the count operation fails for the mind's ID", async () => {
      const mindId = 1;
      const error = new Error("An error occurred");

      (
        supabase.from("saved_minds").select("mind_id, minds(production)", {
          count: "exact",
          head: true,
        }).match as jest.Mock
      ).mockReturnValueOnce({
        error,
      });

      await expect(getSavedMindCount(mindId)).rejects.toThrow(
        "Impossible de récupérer le nombre de sauvegardes.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getLikedMindCount", () => {
    it("should get the count of how many times a mind has been liked for the mind's ID", async () => {
      const mindId = 1;

      (
        supabase.from("liked_minds").select("mind_id", {
          count: "exact",
          head: true,
        }).match as jest.Mock
      ).mockReturnValueOnce({
        count: 10,
      });

      const count = await getLikedMindCount(mindId);

      expect(supabase.from).toHaveBeenCalledWith("liked_minds");
      expect(
        supabase.from("liked_minds").select("mind_id, minds(production)", {
          count: "exact",
          head: true,
        }).match,
      ).toHaveBeenCalledWith({ mind_id: mindId, "minds.production": true });
      expect(count).toEqual(10);
    });

    it("should throw an error if the count operation fails for the mind's ID", async () => {
      const mindId = 1;
      const error = new Error("An error occurred");

      (
        supabase.from("liked_minds").select("mind_id, minds(production)", {
          count: "exact",
          head: true,
        }).match as jest.Mock
      ).mockReturnValueOnce({
        error,
      });

      await expect(getLikedMindCount(mindId)).rejects.toThrow(
        "Impossible de récupérer les minds sauvegardés.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("isMindSaved", () => {
    it("should return whether the mind is saved for the user's ID", async () => {
      const mindId = 1;
      const userId = "user1";

      (
        supabase.from("saved_minds").select("mind_id").match({ mind_id: mindId, user_id: userId })
          .maybeSingle as jest.Mock
      ).mockReturnValueOnce({
        data: { mind_id: 1 },
      });

      const isSaved = await isMindSaved(mindId, userId);

      expect(supabase.from).toHaveBeenCalledWith("saved_minds");
      expect(supabase.from("saved_minds").select).toHaveBeenCalledWith("mind_id");
      expect(supabase.from("saved_minds").select("mind_id").match).toHaveBeenCalledWith({
        mind_id: mindId,
        user_id: userId,
      });
      expect(
        supabase.from("saved_minds").select("mind_id").match({ mind_id: mindId, user_id: userId })
          .maybeSingle,
      ).toHaveBeenCalled();
      expect(isSaved).toBe(true);
    });

    it("should return false if the mind is not saved for the user's ID", async () => {
      const mindId = 1;
      const userId = "user1";

      (
        supabase.from("saved_minds").select("mind_id").match({ mind_id: mindId, user_id: userId })
          .maybeSingle as jest.Mock
      ).mockReturnValueOnce({
        data: null,
      });

      const isSaved = await isMindSaved(mindId, userId);

      expect(isSaved).toBe(false);
    });

    it("should throw an error if the check operation fails for the user's ID", async () => {
      const mindId = 1;
      const userId = "user1";
      const error = new Error("An error occurred");

      (
        supabase.from("saved_minds").select("mind_id").match({ mind_id: mindId, user_id: userId })
          .maybeSingle as jest.Mock
      ).mockReturnValueOnce({
        error,
      });

      await expect(isMindSaved(mindId, userId)).rejects.toThrow(
        "Impossible de vérifier si le mind est sauvegardé.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("isMindLiked", () => {
    it("should return whether the mind is liked for the user's ID", async () => {
      const mindId = 1;
      const userId = "user1";

      (
        supabase.from("liked_minds").select("mind_id").match({ mind_id: mindId, user_id: userId })
          .maybeSingle as jest.Mock
      ).mockReturnValueOnce({
        data: { mind_id: 1 },
      });

      const isLiked = await isMindLiked(mindId, userId);

      expect(supabase.from).toHaveBeenCalledWith("liked_minds");
      expect(supabase.from("liked_minds").select).toHaveBeenCalledWith("mind_id");
      expect(supabase.from("liked_minds").select("mind_id").match).toHaveBeenCalledWith({
        mind_id: mindId,
        user_id: userId,
      });
      expect(
        supabase.from("liked_minds").select("mind_id").match({ mind_id: mindId, user_id: userId })
          .maybeSingle,
      ).toHaveBeenCalled();
      expect(isLiked).toBe(true);
    });

    it("should return false if the mind is not liked for the user's ID", async () => {
      const mindId = 1;
      const userId = "user1";

      (
        supabase.from("liked_minds").select("mind_id").match({ mind_id: mindId, user_id: userId })
          .maybeSingle as jest.Mock
      ).mockReturnValueOnce({
        data: null,
      });

      const isLiked = await isMindLiked(mindId, userId);

      expect(isLiked).toBe(false);
    });

    it("should throw an error if the check operation fails for the user's ID", async () => {
      const mindId = 1;
      const userId = "user1";
      const error = new Error("An error occurred");

      (
        supabase.from("liked_minds").select("mind_id").match({ mind_id: mindId, user_id: userId })
          .maybeSingle as jest.Mock
      ).mockReturnValueOnce({
        error,
      });

      await expect(isMindLiked(mindId, userId)).rejects.toThrow(
        "Impossible de vérifier si le mind est liké.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
});
