import { supabase } from "@/lib/supabase";
import {
  getBestRatedSummaries,
  getSummaries,
  getSummariesByTopicId,
  getSummary,
  getSummaryRating,
  getSummaryReadCount,
  getSummarySavedCount,
  rateSummary,
} from "@/actions/summaries.action";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("Summaries actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSummaries", () => {
    it("should return all summaries", async () => {
      const summaries = [
        {
          id: 1,
          title: "Test summary",
          content: "This is a test summary",
          author_id: "test-author-id",
          production: false,
          authors: {
            id: "test-author-id",
            name: "Test author",
            avatar: "test-avatar.png",
            production: true,
          },
          topics: {
            id: 1,
            name: "Test topic",
            production: true,
          },
        },
        {
          id: 2,
          title: "Another test summary",
          content: "This is another test summary",
          author_id: "another-test-author-id",
          production: true,
          authors: {
            id: "another-test-author-id",
            name: "Another test author",
            avatar: "another-test-avatar.png",
            production: true,
          },
          topics: {
            id: 1,
            name: "Test topic",
            production: true,
          },
        },
      ];

      (
        supabase
          .from("summaries")
          .select("*, authors(name, slug, description), topics(name, slug)")
          .eq("production", true).order as jest.Mock
      ).mockResolvedValueOnce({ error: null, data: summaries?.filter((s) => s.production) });

      const result = await getSummaries();

      expect(
        supabase
          .from("summaries")
          .select("*, authors(name, slug, description), topics(name, slug)")
          .eq("production", true).order,
      ).toHaveBeenCalledWith("created_at", { ascending: false });
      expect(result).toEqual(summaries?.filter((s) => s.production));
    });

    it("should throw an error if the summaries can't be retrieved", async () => {
      (
        supabase
          .from("summaries")
          .select("*, authors(name, slug, description), topics(name, slug)")
          .eq("production", true).order as jest.Mock
      ).mockResolvedValueOnce({ error: "error", data: null });

      await expect(getSummaries()).rejects.toThrow(
        "Une erreur est survenue lors de la récupération des résumés",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getSummarySavedCount", () => {
    it("should return the number of times a summary has been saved", async () => {
      const summaryId = 1;
      const count = 5;

      (
        supabase.from("saved_summaries").select("*, summaries(production)", { count: "exact" })
          .match as jest.Mock
      ).mockResolvedValueOnce({ error: null, count });

      const result = await getSummarySavedCount(summaryId);

      expect(
        supabase.from("saved_summaries").select("*, summaries(production)", { count: "exact" })
          .match,
      ).toHaveBeenCalledWith({ summary_id: summaryId, "summaries.production": true });
      expect(result).toBe(count);
    });

    it("should throw an error if the count of saved summaries can not be retrieved", async () => {
      const summaryId = 1;
      const mockError = new Error("Failed to fetch saved summaries count");

      (
        supabase.from("saved_summaries").select("", { count: "exact" }).match as jest.Mock
      ).mockResolvedValueOnce({ error: mockError, count: null });

      await expect(getSummarySavedCount(summaryId)).rejects.toThrow(
        "Une erreur est survenue lors de la récupération du nombre de sauvegardes",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getSummaryReadCount", () => {
    it("should return the number of reads for a summary", async () => {
      const summaryId = 1;
      const count = 5;

      (
        supabase.from("read_summaries").select("", { count: "exact" }).match as jest.Mock
      ).mockResolvedValueOnce({ error: null, count });

      const result = await getSummaryReadCount(summaryId);

      expect(
        supabase.from("read_summaries").select("", { count: "exact" }).match,
      ).toHaveBeenCalledWith({ summary_id: summaryId, "summaries.production": true });
      expect(result).toBe(count);
    });

    it("should throw an error if the count of read summaries can not be retrieved", async () => {
      const summaryId = 1;
      const mockError = new Error("Failed to fetch read summaries count");

      (
        supabase.from("read_summaries").select("", { count: "exact" }).match as jest.Mock
      ).mockResolvedValueOnce({ error: mockError, count: null });

      await expect(getSummaryReadCount(summaryId)).rejects.toThrow(
        "Une erreur est survenue lors de la récupération du nombre de lectures",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getSummaryRating", () => {
    it("should return the average rating for a summary", async () => {
      const summaryId = 1;
      const data = [{ rating: 5 }, { rating: 4 }, { rating: 3 }];
      const averageRating = 4;

      (supabase.from("summary_ratings").select("rating").eq as jest.Mock).mockResolvedValueOnce({
        error: null,
        data,
      });

      const result = await getSummaryRating(summaryId);

      expect(supabase.from).toHaveBeenCalledWith("summary_ratings");
      expect(supabase.from("summary_ratings").select).toHaveBeenCalledWith("rating");
      expect(supabase.from("summary_ratings").select().eq).toHaveBeenCalledWith(
        "summary_id",
        summaryId,
      );
      expect(result).toBe(averageRating);
    });

    it("should return 0 if there are no ratings for the summary", async () => {
      const summaryId = 1;
      const data: any[] = [];
      const averageRating = 0;

      (supabase.from("summary_ratings").select("rating").eq as jest.Mock).mockResolvedValueOnce({
        error: null,
        data,
      });

      const result = await getSummaryRating(summaryId);

      expect(supabase.from).toHaveBeenCalledWith("summary_ratings");
      expect(supabase.from("summary_ratings").select).toHaveBeenCalledWith("rating");
      expect(supabase.from("summary_ratings").select().eq).toHaveBeenCalledWith(
        "summary_id",
        summaryId,
      );
      expect(result).toBe(averageRating);
    });

    it("should throw an error if the rating can not be retrieved", async () => {
      const summaryId = 1;
      const mockError = new Error("Failed to fetch summary rating");

      (supabase.from("summary_ratings").select("rating").eq as jest.Mock).mockResolvedValueOnce({
        error: mockError,
        data: null,
      });

      await expect(getSummaryRating(summaryId)).rejects.toThrow(
        "Une erreur est survenue lors de la récupération de la note",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getSummary", () => {
    it("should return the summary's data", async () => {
      const summaryId = 1;
      const data = [
        { id: 1, title: "Test summary", production: true },
        { id: 2, title: "Another test summary", production: false },
      ];

      (
        supabase
          .from("summaries")
          .select("*, authors(name, slug, description), topics(name, slug), chapters(*)")
          .match({
            id: summaryId,
            production: true,
          }).single as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: data?.filter((s) => s.production),
      });

      const result = await getSummary(summaryId);

      expect(
        supabase
          .from("summaries")
          .select("*, authors(name, slug, description), topics(name, slug), chapters(*)")
          .match({
            id: summaryId,
            production: true,
          }).single,
      ).toHaveBeenCalled();
      expect(result).toEqual(data?.filter((s) => s.production));
    });

    it("should throw an error if the summary's data can not be retrieved", async () => {
      const summaryId = 1;
      const mockError = new Error("Failed to fetch summary data");

      (
        supabase
          .from("summaries")
          .select("*, authors(name, slug, description), topics(name, slug), chapters(*)")
          .match({
            id: summaryId,
            production: true,
          }).single as jest.Mock
      ).mockResolvedValueOnce({
        error: mockError,
        data: null,
      });

      await expect(getSummary(summaryId)).rejects.toThrow(
        "Une erreur est survenue lors de la récupération du résumé",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getSummariesByTopicId", () => {
    it("should return the summaries for a topic", async () => {
      const topicId = 1;
      const summaries = [
        {
          id: 1,
          production: true,
          title: "Test summary",
          content: "This is a test summary",
          author_id: "test-author-id",
          authors: {
            id: "test-author-id",
            name: "Test author",
            avatar: "test-avatar.png",
          },
        },
        {
          id: 2,
          production: false,
          title: "Another test summary",
          content: "This is another test summary",
          author_id: "another-test-author-id",
          authors: {
            id: "another-test-author-id",
            name: "Another test author",
            avatar: "another-test-avatar.png",
          },
        },
      ];

      (
        supabase.from("summaries").select("*, authors(name, slug, description), topics(name, slug)")
          .match as jest.Mock
      ).mockResolvedValueOnce({ error: null, data: summaries?.filter((s) => s.production) });

      const result = await getSummariesByTopicId(topicId);

      expect(
        supabase.from("summaries").select("*, authors(name, slug, description), topics(name, slug)")
          .match,
      ).toHaveBeenCalledWith({ topic_id: topicId, production: true });
      expect(result).toEqual(summaries?.filter((s) => s.production));
    });

    it("should throw an error if the summaries can't be retrieved", async () => {
      const topicId = 1;
      const mockError = new Error("Failed to fetch summaries");

      (
        supabase.from("summaries").select("*, authors(name, slug, description), topics(name, slug)")
          .match as jest.Mock
      ).mockResolvedValueOnce({ error: mockError, data: null });

      await expect(getSummariesByTopicId(topicId)).rejects.toThrow(
        "Une erreur est survenue lors de la récupération des résumés",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("rateSummary", () => {
    it("should return a success message if the summary is rated", async () => {
      const userId = "test-user-id";
      const summaryId = 1;
      const rating = 5;

      (supabase.from("summary_ratings").upsert as jest.Mock).mockResolvedValueOnce({ error: null });

      const result = await rateSummary(userId, summaryId, rating);

      expect(supabase.from).toHaveBeenCalledWith("summary_ratings");
      expect(supabase.from("summary_ratings").upsert).toHaveBeenCalledWith({
        user_id: userId,
        summary_id: summaryId,
        rating,
      });
      expect(result).toEqual({ success: true });
    });

    it("should throw an error if the summary can not be rated", async () => {
      const userId = "test-user-id";
      const summaryId = 1;
      const rating = 5;
      const mockError = new Error("Failed to rate the summary");

      (supabase.from("summary_ratings").upsert as jest.Mock).mockResolvedValueOnce({
        error: mockError,
      });

      await expect(rateSummary(userId, summaryId, rating)).rejects.toThrow(
        "Une erreur est survenue lors de la notation du résumé",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getBestRatedSummaries", () => {
    it("should return the best rated summaries", async () => {
      const summaries = [
        {
          summaries: {
            id: 1,
            title: "Test summary",
            content: "This is a test summary",
            author_id: "test-author-id",
            production: true,
            authors: {
              id: "test-author-id",
              name: "Test author",
              avatar: "test-avatar.png",
              production: true,
            },
            topics: {
              id: 1,
              name: "Test topic",
              production: true,
            },
          },
        },
        {
          summaries: {
            id: 2,
            title: "Another test summary",
            content: "This is another test summary",
            author_id: "another-test-author-id",
            production: true,
            authors: {
              id: "another-test-author-id",
              name: "Another test author",
              avatar: "another-test-avatar.png",
              production: true,
            },
            topics: {
              id: 1,
              name: "Test topic",
              production: true,
            },
          },
        },
      ];

      (
        supabase
          .from("summary_ratings")
          .select("*, summaries(*, authors(name, slug, description), topics(name, slug)")
          .order as jest.Mock
      ).mockResolvedValueOnce({ error: null, data: summaries });

      const result = await getBestRatedSummaries();

      expect(
        supabase
          .from("summary_ratings")
          .select("*, summaries(*, authors(name, slug, description), topics(name, slug)").order,
      ).toHaveBeenCalledWith("rating", { ascending: false });
      expect(result).toEqual(
        summaries?.map((rating) => rating.summaries)?.filter((s) => s.production),
      );
    });

    it("should throw an error if the best rated summaries can not be retrieved", async () => {
      const mockError = new Error("Failed to fetch best rated summaries");

      (
        supabase
          .from("summary_ratings")
          .select("*, summaries(*, authors(name, slug, description), topics(name, slug)")
          .order as jest.Mock
      ).mockResolvedValueOnce({ error: mockError, data: null });

      await expect(getBestRatedSummaries()).rejects.toThrow(
        "Une erreur est survenue lors de la récupération des résumés",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });
});
