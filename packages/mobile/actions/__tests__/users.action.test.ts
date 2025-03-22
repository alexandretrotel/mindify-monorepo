import {
  getUserTopics,
  getUserTopicsCount,
  getUserReadSummaries,
  getUserReadSummariesCount,
  getUserReadSummariesTimpestamps,
  getUserSavedMinds,
  getUserSavedMindsCount,
  getUserFriendsCount,
  getUserFriends,
  getUserSrsData,
  getUserTopicsProgression,
  updateProfile,
  updateUserTopics,
  saveSummary,
  unsaveSummary,
  hasUserReadSummary,
  hasUserSavedSummary,
  markSummaryAsRead,
  markSummaryAsUnread,
  getUserSummaryRating,
  getUserSavedSummaries,
} from "@/actions/users.action";
import { supabase } from "@/lib/supabase";
import { getSummariesCountByTopic } from "@/actions/topics.action";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    rpc: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn(),
    single: jest.fn(),
    auth: {
      updateUser: jest.fn(),
    },
  },
}));

jest.mock("@/actions/topics.action", () => ({
  getSummariesCountByTopic: jest.fn(),
}));

describe("Users Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("hasUserSavedSummary", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return true if user has saved the summary", async () => {
      const userId = "user1";
      const summaryId = 1;

      (
        supabase.from("saved_summaries").select("*").match({
          user_id: userId,
          summary_id: summaryId,
        }).maybeSingle as jest.Mock
      ).mockReturnValue({
        data: { user_id: userId, summary_id: summaryId },
        error: null,
      });

      const result = await hasUserSavedSummary(userId, summaryId);

      expect(
        supabase.from("saved_summaries").select("*").match({
          user_id: userId,
          summary_id: summaryId,
        }).maybeSingle,
      ).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it("should return false if user has not saved the summary", async () => {
      const userId = "user1";
      const summaryId = 1;

      (
        supabase.from("saved_summaries").select("*").match({
          user_id: userId,
          summary_id: summaryId,
        }).maybeSingle as jest.Mock
      ).mockReturnValue({
        data: null,
        error: null,
      });

      const result = await hasUserSavedSummary(userId, summaryId);

      expect(
        supabase.from("saved_summaries").select("*").match({
          user_id: userId,
          summary_id: summaryId,
        }).maybeSingle,
      ).toHaveBeenCalled();
      expect(result).toEqual(false);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const summaryId = 1;
      const error = new Error("Error");

      (
        supabase
          .from("saved_summaries")
          .select("*")
          .match({ user_id: userId, summary_id: summaryId }).maybeSingle as jest.Mock
      ).mockReturnValue({
        data: null,
        error,
      });

      await expect(hasUserSavedSummary(userId, summaryId)).rejects.toThrow(
        "Impossible de vérifier si le résumé est sauvegardé.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserSummaryRating", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user summary rating", async () => {
      const userId = "user1";
      const summaryId = 1;
      const mockData = { rating: 1 };

      (
        supabase.from("summary_ratings").select("rating").match({
          user_id: userId,
          summary_id: summaryId,
        }).maybeSingle as jest.Mock
      ).mockReturnValue({
        data: mockData,
        error: null,
      });

      const result = await getUserSummaryRating(userId, summaryId);

      expect(
        supabase.from("summary_ratings").select("rating").match({
          user_id: userId,
          summary_id: summaryId,
        }).maybeSingle,
      ).toHaveBeenCalled();
      expect(result).toEqual(mockData.rating);
    });

    it("should return undefined if no data found", async () => {
      const userId = "user1";
      const summaryId = 1;

      (
        supabase.from("summary_ratings").select("rating").match({
          user_id: userId,
          summary_id: summaryId,
        }).maybeSingle as jest.Mock
      ).mockReturnValue({
        data: null,
        error: null,
      });

      const result = await getUserSummaryRating(userId, summaryId);

      expect(
        supabase.from("summary_ratings").select("rating").match({
          user_id: userId,
          summary_id: summaryId,
        }).maybeSingle,
      ).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("hasUserReadSummary", () => {
    const mockUserId = "user1";
    const mockSummaryId = 1;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return true if user has read the summary", async () => {
      (
        supabase.from("saved_summaries").select("*").match({
          user_id: mockUserId,
          summary_id: mockSummaryId,
        }).maybeSingle as jest.Mock
      ).mockReturnValue({
        data: { user_id: mockUserId, summary_id: mockSummaryId },
        error: null,
      });

      const result = await hasUserReadSummary(mockUserId, mockSummaryId);

      expect(
        supabase.from("read_summaries").select("*").match({
          user_id: mockUserId,
          summary_id: mockSummaryId,
        }).maybeSingle,
      ).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it("should return false if user has not read the summary", async () => {
      (
        supabase.from("read_summaries").select("*").match({
          user_id: mockUserId,
          summary_id: mockSummaryId,
        }).maybeSingle as jest.Mock
      ).mockReturnValue({
        data: null,
        error: null,
      });

      const result = await hasUserReadSummary(mockUserId, mockSummaryId);

      expect(
        supabase.from("read_summaries").select("*").match({
          user_id: mockUserId,
          summary_id: mockSummaryId,
        }).maybeSingle,
      ).toHaveBeenCalled();
      expect(result).toEqual(false);
    });

    it("should throw error if error occurred", async () => {
      const error = new Error("Error");

      (
        supabase.from("read_summaries").select("*").match({
          user_id: mockUserId,
          summary_id: mockSummaryId,
        }).maybeSingle as jest.Mock
      ).mockReturnValue({
        data: null,
        error,
      });

      await expect(hasUserReadSummary(mockUserId, mockSummaryId)).rejects.toThrow(
        "Impossible de vérifier si le résumé est lu.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserTopics", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user topics", async () => {
      const userId = "user1";
      const mockData = [
        { topics: { id: 1, title: "Test", production: true } },
        { topics: { id: 2, title: "Test 2", production: false } },
      ];
      const mockResult = [{ id: 1, title: "Test", production: true }];

      (supabase.from("user_topics").select("topics(*)").match as jest.Mock).mockReturnValue({
        data: mockData?.filter((data) => data.topics.production),
        error: null,
      });

      const result = await getUserTopics(userId);

      expect(supabase.from("user_topics").select("topics(*)").match).toHaveBeenCalledWith({
        user_id: userId,
        "topics.production": true,
      });
      expect(result).toEqual(mockResult);
    });

    it("should return empty array if no data found", async () => {
      const userId = "user1";

      (supabase.from("user_topics").select("topics(*)").match as jest.Mock).mockReturnValue({
        data: null,
        error: null,
      });

      const result = await getUserTopics(userId);

      expect(supabase.from("user_topics").select("topics(*)").match).toHaveBeenCalledWith({
        user_id: userId,
        "topics.production": true,
      });
      expect(result).toEqual([]);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (supabase.from("user_topics").select("topics(*)").match as jest.Mock).mockReturnValue({
        data: null,
        error: error,
      });

      await expect(getUserTopics(userId)).rejects.toThrow("Impossible de récupérer les intérêts.");

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("updateUserTopics", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should update user topics by removing a topic", async () => {
      const userId = "user1";
      const userTopics = [
        {
          topics: {
            id: 1,
            name: "Test",
            created_at: "2021-01-01T00:00:00.000Z",
            slug: "test",
            black_icon: null,
            white_icon: null,
            emoji: null,
          },
        },
        {
          topics: {
            id: 2,
            name: "Test 2",
            created_at: "2021-01-01T00:00:00.000Z",
            slug: "test-2",
            black_icon: null,
            white_icon: null,
            emoji: null,
          },
        },
      ];
      const selectedTopics = [
        {
          id: 1,
          name: "Test",
          created_at: "2021-01-01T00:00:00.000Z",
          slug: "test",
          black_icon: null,
          white_icon: null,
          emoji: null,
          production: true,
        },
      ];

      (supabase.from("user_topics").select("topics(*)").eq as jest.Mock).mockReturnValue({
        data: userTopics,
        error: null,
      });

      (supabase.from("user_topics").delete().in as jest.Mock).mockReturnValue({
        error: null,
      });

      (supabase.from("user_topics").insert as jest.Mock).mockReturnValue({
        error: null,
      });

      const result = await updateUserTopics(userId, selectedTopics);

      expect(supabase.from("user_topics").select("topics(*)").eq).toHaveBeenCalledWith(
        "user_id",
        userId,
      );
      expect(supabase.from("user_topics").delete().in).toHaveBeenCalledWith("topic_id", [2]);
      expect(result).toEqual({ success: true });
    });

    it("should update user topics by adding a topic", async () => {
      const userId = "user1";
      const userTopics = [
        {
          topics: {
            id: 1,
            name: "Test",
            created_at: "2021-01-01T00:00:00.000Z",
            slug: "test",
            black_icon: null,
            white_icon: null,
            emoji: null,
            production: true,
          },
        },
      ];
      const selectedTopics = [
        {
          id: 1,
          name: "Test",
          created_at: "2021-01-01T00:00:00.000Z",
          slug: "test",
          black_icon: null,
          white_icon: null,
          emoji: null,
          production: true,
        },
        {
          id: 2,
          name: "Test 2",
          created_at: "2021-01-01T00:00:00.000Z",
          slug: "test-2",
          black_icon: null,
          white_icon: null,
          emoji: null,
          production: true,
        },
      ];

      (supabase.from("user_topics").select("topics(*)").eq as jest.Mock).mockReturnValue({
        data: userTopics,
        error: null,
      });

      (supabase.from("user_topics").delete().in as jest.Mock).mockReturnValue({
        error: null,
      });

      (supabase.from("user_topics").insert as jest.Mock).mockReturnValue({
        error: null,
      });

      const result = await updateUserTopics(userId, selectedTopics);

      expect(supabase.from("user_topics").select("topics(*)").eq).toHaveBeenCalledWith(
        "user_id",
        userId,
      );
      expect(supabase.from("user_topics").insert).toHaveBeenCalledWith([
        {
          user_id: userId,
          topic_id: 2,
        },
      ]);
      expect(result).toEqual({ success: true });
    });

    it("should update user topics by adding and removing topics", async () => {
      const userId = "user1";
      const userTopics = [
        {
          topics: {
            id: 1,
            name: "Test",
            created_at: "2021-01-01T00:00:00.000Z",
            slug: "test",
            black_icon: null,
            white_icon: null,
            emoji: null,
          },
        },
        {
          topics: {
            id: 2,
            name: "Test 2",
            created_at: "2021-01-01T00:00:00.000Z",
            slug: "test-2",
            black_icon: null,
            white_icon: null,
            emoji: null,
            production: true,
          },
        },
      ];
      const selectedTopics = [
        {
          id: 1,
          name: "Test",
          created_at: "2021-01-01T00:00:00.000Z",
          slug: "test",
          black_icon: null,
          white_icon: null,
          emoji: null,
          production: true,
        },
        {
          id: 3,
          name: "Test 3",
          created_at: "2021-01-01T00:00:00.000Z",
          slug: "test-3",
          black_icon: null,
          white_icon: null,
          emoji: null,
          production: true,
        },
      ];

      (supabase.from("user_topics").select("topics(*)").eq as jest.Mock).mockReturnValue({
        data: userTopics,
        error: null,
      });

      (supabase.from("user_topics").delete().in as jest.Mock).mockReturnValue({
        error: null,
      });

      (supabase.from("user_topics").insert as jest.Mock).mockReturnValue({
        error: null,
      });

      const result = await updateUserTopics(userId, selectedTopics);

      expect(supabase.from("user_topics").select("topics(*)").eq).toHaveBeenCalledWith(
        "user_id",
        userId,
      );
      expect(supabase.from("user_topics").delete().in).toHaveBeenCalledWith("topic_id", [2]);
      expect(supabase.from("user_topics").insert).toHaveBeenCalledWith([
        {
          user_id: userId,
          topic_id: 3,
        },
      ]);
      expect(result).toEqual({ success: true });
    });

    it("should update user topics by removing all topics", async () => {
      const userId = "user1";
      const userTopics = [
        {
          topics: {
            id: 1,
            name: "Test",
            created_at: "2021-01-01T00:00:00.000Z",
            slug: "test",
            black_icon: null,
            white_icon: null,
            emoji: null,
          },
        },
      ];
      const selectedTopics: any[] = [];

      (supabase.from("user_topics").select("topics(*)").eq as jest.Mock).mockReturnValue({
        data: userTopics,
        error: null,
      });

      (supabase.from("user_topics").delete().in as jest.Mock).mockReturnValue({
        error: null,
      });

      (supabase.from("user_topics").insert as jest.Mock).mockReturnValue({
        error: null,
      });

      const result = await updateUserTopics(userId, selectedTopics);

      expect(supabase.from("user_topics").select("topics(*)").eq).toHaveBeenCalledWith(
        "user_id",
        userId,
      );
      expect(supabase.from("user_topics").delete().in).toHaveBeenCalledWith("topic_id", [1]);
      expect(result).toEqual({ success: true });
    });

    it("should throw error if error occurred when fetching user topics", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (supabase.from("user_topics").select("topics(*)").eq as jest.Mock).mockReturnValue({
        data: null,
        error,
      });

      await expect(updateUserTopics(userId, [])).rejects.toThrow(
        "Impossible de récupérer les intérêts.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });

    it("should throw error if error occurred when deleting user topics", async () => {
      const userId = "user1";
      const userTopics = [
        {
          topics: {
            id: 1,
            name: "Test",
            created_at: "2021-01-01T00:00:00.000Z",
            slug: "test",
            black_icon: null,
            white_icon: null,
            emoji: null,
          },
        },
      ];
      const selectedTopics: any[] = [];
      const error = new Error("Error");

      (supabase.from("user_topics").select("topics(*)").eq as jest.Mock).mockReturnValue({
        data: userTopics,
        error: null,
      });

      (supabase.from("user_topics").delete().in as jest.Mock).mockReturnValue({
        error,
      });

      await expect(updateUserTopics(userId, selectedTopics)).rejects.toThrow(
        "Impossible de mettre à jour les intérêts.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });

    it("should throw error if error occurred when inserting user topics", async () => {
      const userId = "user1";
      const userTopics = [
        {
          topics: {
            id: 1,
            name: "Test",
            created_at: "2021-01-01T00:00:00.000Z",
            slug: "test",
            black_icon: null,
            white_icon: null,
            emoji: null,
            production: true,
          },
        },
      ];
      const selectedTopics = [
        {
          id: 1,
          name: "Test",
          created_at: "2021-01-01T00:00:00.000Z",
          slug: "test",
          black_icon: null,
          white_icon: null,
          emoji: null,
          production: true,
        },
        {
          id: 2,
          name: "Test 2",
          created_at: "2021-01-01T00:00:00.000Z",
          slug: "test-2",
          black_icon: null,
          white_icon: null,
          emoji: null,
          production: true,
        },
      ];
      const error = new Error("Error");

      (supabase.from("user_topics").select("topics(*)").eq as jest.Mock).mockReturnValue({
        data: userTopics,
        error: null,
      });

      (supabase.from("user_topics").delete().in as jest.Mock).mockReturnValue({
        error: null,
      });

      (supabase.from("user_topics").insert as jest.Mock).mockReturnValue({
        error,
      });

      await expect(updateUserTopics(userId, selectedTopics)).rejects.toThrow(
        "Impossible de mettre à jour les intérêts.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserTopicsCount", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user topics count", async () => {
      const userId = "user1";
      const mockCount = 5;

      (
        supabase.from("user_topics").select("count(*)", { count: "exact" }).match as jest.Mock
      ).mockReturnValue({
        count: mockCount,
        error: null,
      });

      const result = await getUserTopicsCount(userId);

      expect(
        supabase.from("user_topics").select("count(*)", { count: "exact" }).match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "topics.production": true,
      });
      expect(result).toEqual(mockCount);
    });

    it("should return 0 if no data found", async () => {
      const userId = "user1";

      (
        supabase.from("user_topics").select("count(*)", { count: "exact" }).match as jest.Mock
      ).mockReturnValue({
        count: 0,
        error: null,
      });

      const result = await getUserTopicsCount(userId);

      expect(
        supabase.from("user_topics").select("count(*)", { count: "exact" }).match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "topics.production": true,
      });
      expect(result).toEqual(0);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (
        supabase.from("user_topics").select("count(*)", { count: "exact" }).match as jest.Mock
      ).mockReturnValue({
        count: 0,
        error: error,
      });

      await expect(getUserTopicsCount(userId)).rejects.toThrow(
        "Impossible de récupérer les intérêts.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserReadSummaries", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user read summaries", async () => {
      const userId = "user1";
      const mockData = [
        {
          summaries: {
            id: 1,
            title: "Test",
            production: true,
            authors: {
              name: "Test",
              production: true,
            },
            topics: {
              name: "Test",
              production: true,
            },
          },
        },
        {
          summaries: {
            id: 2,
            title: "Test 2",
            production: true,
            authors: {
              name: "Test 2",
              production: true,
            },
            topics: {
              name: "Test 2",
              production: true,
            },
          },
        },
        {
          summaries: {
            id: 3,
            title: "Test 3",
            production: false,
            authors: {
              name: "Test 3",
              production: false,
            },
            topics: {
              name: "Test 3",
              production: false,
            },
          },
        },
      ];
      const foundSummaries = [
        {
          id: 1,
          title: "Test",
          production: true,
          authors: { name: "Test", production: true },
          topics: { name: "Test", production: true },
        },
        {
          id: 2,
          title: "Test 2",
          production: true,
          authors: { name: "Test 2", production: true },
          topics: { name: "Test 2", production: true },
        },
      ];

      (
        supabase.from("read_summaries").select("*, summaries(*, authors(name), topics(name))")
          .match as jest.Mock
      ).mockReturnValue({
        data: mockData?.filter((data) => data.summaries.production),
        error: null,
      });

      const result = await getUserReadSummaries(userId);

      expect(
        supabase.from("read_summaries").select("*, summaries(*, authors(name), topics(name))")
          .match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "summaries.production": true,
      });
      expect(result).toEqual(foundSummaries);
    });

    it("should return empty array if no data found", async () => {
      const userId = "user1";

      (
        supabase.from("read_summaries").select("*, summaries(*, authors(name), topics(name))")
          .match as jest.Mock
      ).mockReturnValue({
        data: null,
        error: null,
      });

      const result = await getUserReadSummaries(userId);

      expect(
        supabase.from("read_summaries").select("*, summaries(*, authors(name), topics(name))")
          .match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "summaries.production": true,
      });
      expect(result).toEqual([]);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (
        supabase.from("read_summaries").select("*, summaries(*, authors(name), topics(name))")
          .match as jest.Mock
      ).mockReturnValue({
        data: null,
        error: error,
      });

      await expect(getUserReadSummaries(userId)).rejects.toThrow(
        "Impossible de récupérer les résumés lus.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserSavedSummaries", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user saved summaries", async () => {
      const userId = "user1";
      const mockData = [
        {
          summaries: {
            id: 1,
            title: "Test",
            production: true,
            authors: {
              name: "Test",
              production: true,
            },
            topics: {
              name: "Test",
              production: true,
            },
          },
        },
        {
          summaries: {
            id: 2,
            title: "Test 2",
            production: true,
            authors: {
              name: "Test 2",
              production: true,
            },
            topics: {
              name: "Test 2",
              production: true,
            },
          },
        },
        {
          summaries: {
            id: 3,
            title: "Test 3",
            production: false,
            authors: {
              name: "Test 3",
              production: false,
            },
            topics: {
              name: "Test 3",
              production: false,
            },
          },
        },
      ];
      const foundSummaries = [
        {
          id: 1,
          title: "Test",
          production: true,
          authors: { name: "Test", production: true },
          topics: { name: "Test", production: true },
        },
        {
          id: 2,
          title: "Test 2",
          production: true,
          authors: { name: "Test 2", production: true },
          topics: { name: "Test 2", production: true },
        },
      ];

      (
        supabase.from("saved_summaries").select("*, summaries(*, authors(name), topics(name))")
          .match as jest.Mock
      ).mockReturnValue({
        data: mockData?.filter((data) => data.summaries.production),
        error: null,
      });

      const result = await getUserSavedSummaries(userId);

      expect(
        supabase.from("saved_summaries").select("*, summaries(*, authors(name), topics(name))")
          .match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "summaries.production": true,
      });
      expect(result).toEqual(foundSummaries);
    });

    it("should return empty array if no data found", async () => {
      const userId = "user1";

      (
        supabase.from("saved_summaries").select("*, summaries(*, authors(name), topics(name))")
          .match as jest.Mock
      ).mockReturnValue({
        data: null,
        error: null,
      });

      const result = await getUserSavedSummaries(userId);

      expect(
        supabase.from("saved_summaries").select("*, summaries(*, authors(name), topics(name))")
          .match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "summaries.production": true,
      });
      expect(result).toEqual([]);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (
        supabase.from("saved_summaries").select("*, summaries(*, authors(name), topics(name))")
          .match as jest.Mock
      ).mockReturnValue({
        data: null,
        error: error,
      });

      await expect(getUserSavedSummaries(userId)).rejects.toThrow(
        "Impossible de récupérer les résumés lus.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserReadSummariesCount", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user read summaries count", async () => {
      const userId = "user1";
      const mockCount = 5;

      (
        supabase
          .from("read_summaries")
          .select("user_id, summaries(production)", { count: "exact", head: true })
          .match as jest.Mock
      ).mockReturnValue({
        count: mockCount,
        error: null,
      });

      const result = await getUserReadSummariesCount(userId);

      expect(
        supabase.from("read_summaries").select("user_id, summaries(production)", {
          count: "exact",
          head: true,
        }).match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "summaries.production": true,
      });
      expect(result).toEqual(mockCount);
    });

    it("should return 0 if no data found", async () => {
      const userId = "user1";

      (
        supabase.from("read_summaries").select("user_id, summaries(production)", {
          count: "exact",
          head: true,
        }).match as jest.Mock
      ).mockReturnValue({
        count: 0,
        error: null,
      });

      const result = await getUserReadSummariesCount(userId);

      expect(
        supabase.from("read_summaries").select("user_id, summaries(production)", {
          count: "exact",
          head: true,
        }).match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "summaries.production": true,
      });
      expect(result).toEqual(0);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (
        supabase.from("read_summaries").select("user_id, summaries(production)", {
          count: "exact",
          head: true,
        }).match as jest.Mock
      ).mockReturnValue({
        count: 0,
        error: error,
      });

      await expect(getUserReadSummariesCount(userId)).rejects.toThrow(
        "Impossible de récupérer les résumés lus.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserReadSummariesTimpestamps", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user read summaries timestamps", async () => {
      const userId = "user1";
      const mockData = [
        { read_at: "2021-01-01T00:00:00.000Z" },
        { read_at: "2021-01-02T00:00:00.000Z" },
      ];

      (
        supabase.from("read_summaries").select("read_at, summaries(production)").match as jest.Mock
      ).mockReturnValue({
        data: mockData,
        error: null,
      });

      const result = await getUserReadSummariesTimpestamps(userId);

      expect(
        supabase.from("read_summaries").select("read_at, summaries(production)").match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "summaries.production": true,
      });
      expect(result).toEqual(mockData);
    });

    it("should return empty array if no data found", async () => {
      const userId = "user1";

      (
        supabase.from("read_summaries").select("read_at, summaries(production)").match as jest.Mock
      ).mockReturnValue({
        data: null,
        error: null,
      });

      const result = await getUserReadSummariesTimpestamps(userId);

      expect(
        supabase.from("read_summaries").select("read_at, summaries(production)").match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "summaries.production": true,
      });
      expect(result).toEqual([]);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (
        supabase.from("read_summaries").select("read_at, summaries(production)").match as jest.Mock
      ).mockReturnValue({
        data: null,
        error,
      });

      await expect(getUserReadSummariesTimpestamps(userId)).rejects.toThrow(
        "Impossible de récupérer les résumés lus.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserSavedMinds", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user saved minds", async () => {
      const userId = "user1";
      const mockData = [
        {
          minds: {
            id: 1,
            title: "Test",
            production: true,
            summaries: { authors: { name: "Author" } },
          },
        },
        {
          minds: {
            id: 2,
            title: "Test 2",
            production: true,
            summaries: { authors: { name: "Author 2" } },
          },
        },
        {
          minds: {
            id: 3,
            title: "Test 3",
            production: false,
            summaries: { authors: { name: "Author 3" } },
          },
        },
      ];
      const foundMinds = [
        {
          id: 1,
          title: "Test",
          production: true,
          summaries: { authors: { name: "Author" } },
        },
        {
          id: 2,
          title: "Test 2",
          production: true,
          summaries: { authors: { name: "Author 2" } },
        },
      ];

      (
        supabase.from("saved_minds").select("*, minds(*, summaries(title, authors(name)))")
          .match as jest.Mock
      ).mockReturnValue({
        data: mockData?.filter((data) => data.minds.production),
        error: null,
      });

      const result = await getUserSavedMinds(userId);

      expect(
        supabase.from("saved_minds").select("*, minds(*, summaries(title, authors(name))").match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "minds.production": true,
      });
      expect(result).toEqual(foundMinds);
    });

    it("should return empty array if no data found", async () => {
      const userId = "user1";

      (
        supabase.from("saved_minds").select("*, minds(*, summaries(title, authors(name)))")
          .match as jest.Mock
      ).mockReturnValue({
        data: null,
        error: null,
      });

      const result = await getUserSavedMinds(userId);

      expect(
        supabase.from("saved_minds").select("*, minds(*, summaries(title, authors(name)))").match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "minds.production": true,
      });
      expect(result).toEqual([]);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (
        supabase.from("saved_minds").select("*, minds(*, summaries(title, authors(name)))")
          .match as jest.Mock
      ).mockReturnValue({
        data: null,
        error: error,
      });

      await expect(getUserSavedMinds(userId)).rejects.toThrow(
        "Impossible de récupérer les esprits sauvegardés.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserSavedMindsCount", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user saved minds count", async () => {
      const userId = "user1";
      const mockCount = 5;

      (
        supabase.from("saved_minds").select("user_id, minds(production)", {
          count: "exact",
          head: true,
        }).match as jest.Mock
      ).mockReturnValue({
        count: mockCount,
        error: null,
      });

      const result = await getUserSavedMindsCount(userId);

      expect(
        supabase.from("saved_minds").select("user_id, minds(production)", {
          count: "exact",
          head: true,
        }).match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "minds.production": true,
      });
      expect(result).toEqual(mockCount);
    });

    it("should return 0 if no data found", async () => {
      const userId = "user1";

      (
        supabase.from("saved_minds").select("user_id, minds(production)", {
          count: "exact",
          head: true,
        }).match as jest.Mock
      ).mockReturnValue({
        count: 0,
        error: null,
      });

      const result = await getUserSavedMindsCount(userId);

      expect(
        supabase.from("saved_minds").select("user_id, minds(production)", {
          count: "exact",
          head: true,
        }).match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "minds.production": true,
      });
      expect(result).toEqual(0);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (
        supabase.from("saved_minds").select("user_id, minds(production)", {
          count: "exact",
          head: true,
        }).match as jest.Mock
      ).mockReturnValue({
        count: 0,
        error: error,
      });

      await expect(getUserSavedMindsCount(userId)).rejects.toThrow(
        "Impossible de récupérer les esprits sauvegardés.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserFriendsCount", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user friends count", async () => {
      const userId = "user1";
      const mockData = [
        { friend_id: "user2", created_at: "2021-01-01T00:00:00.000Z", raw_user_meta_data: null },
        { friend_id: "user3", created_at: "2021-01-01T00:00:00.000Z", raw_user_meta_data: null },
      ];

      (supabase.rpc as jest.Mock).mockReturnValue({
        data: mockData,
        error: null,
      });

      const result = await getUserFriendsCount(userId);

      expect(supabase.rpc).toHaveBeenCalledWith("get_friends_metadata", { p_user_id: userId });
      expect(result).toEqual(mockData?.length);
    });

    it("should return 0 if no data found", async () => {
      const userId = "user1";

      (supabase.rpc as jest.Mock).mockReturnValue({
        data: 0,
        error: null,
      });

      const result = await getUserFriendsCount(userId);

      expect(supabase.rpc).toHaveBeenCalledWith("get_friends_metadata", { p_user_id: userId });
      expect(result).toEqual(0);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (supabase.rpc as jest.Mock).mockReturnValue({
        data: null,
        error: error,
      });

      await expect(getUserFriendsCount(userId)).rejects.toThrow(
        "Impossible de récupérer le nombre d'amis.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserFriends", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user friends", async () => {
      const userId = "user1";
      const mockData = [
        { friend_id: "user2", created_at: "2021-01-01T00:00:00.000Z", raw_user_meta_data: null },
        { friend_id: "user3", created_at: "2021-01-01T00:00:00.000Z", raw_user_meta_data: null },
      ];

      (supabase.rpc as jest.Mock).mockReturnValue({
        data: mockData,
        error: null,
      });

      const result = await getUserFriends(userId);

      expect(supabase.rpc).toHaveBeenCalledWith("get_friends_metadata", { p_user_id: userId });
      expect(result).toEqual(mockData);
    });

    it("should return empty array if no data found", async () => {
      const userId = "user1";

      (supabase.rpc as jest.Mock).mockReturnValue({
        data: [],
        error: null,
      });

      const result = await getUserFriends(userId);

      expect(supabase.rpc).toHaveBeenCalledWith("get_friends_metadata", { p_user_id: userId });
      expect(result).toEqual([]);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (supabase.rpc as jest.Mock).mockReturnValue({
        data: null,
        error: error,
      });

      await expect(getUserFriends(userId)).rejects.toThrow("Impossible de récupérer les amis.");

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserSrsData", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user SRS data", async () => {
      const userId = "user1";
      const mockSrsData = [
        {
          id: 1,
          user_id: userId,
          minds: {
            id: 1,
            summaries: { title: "Test", authors: { name: "Author" } },
            production: true,
          },
        },
        {
          id: 2,
          user_id: userId,
          minds: {
            id: 2,
            summaries: { title: "Test 2", authors: { name: "Author 2" } },
            production: true,
          },
        },
        {
          id: 3,
          user_id: userId,
          minds: {
            id: 3,
            summaries: { title: "Test 3", authors: { name: "Author 3" } },
            production: false,
          },
        },
      ];

      (
        supabase.from("srs_data").select("*, minds(*, summaries(title, authors(name)))")
          .match as jest.Mock
      ).mockReturnValue({
        data: mockSrsData?.filter((data) => data.minds.production),
        error: null,
      });

      const result = await getUserSrsData(userId);

      expect(
        supabase.from("srs_data").select("*, minds(*, summaries(title, authors(name)))").match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "minds.production": true,
      });
      expect(result).toEqual(mockSrsData?.filter((data) => data.minds.production));
    });

    it("should return empty array if no data found", async () => {
      const userId = "user1";

      (
        supabase.from("srs_data").select("*, minds(*, summaries(title, authors(name)))")
          .match as jest.Mock
      ).mockReturnValue({
        data: null,
        error: null,
      });

      const result = await getUserSrsData(userId);

      expect(
        supabase.from("srs_data").select("*, minds(*, summaries(title, authors(name)))").match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "minds.production": true,
      });
      expect(result).toEqual([]);
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (
        supabase.from("srs_data").select("*, minds(*, summaries(title, authors(name)))")
          .match as jest.Mock
      ).mockReturnValue({
        data: null,
        error: error,
      });

      await expect(getUserSrsData(userId)).rejects.toThrow(
        "Impossible de récupérer les données SRS.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserTopicsProgression", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch user topics progression", async () => {
      const userId = "user1";
      const mockData = [
        { summaries: { topics: { id: 1, production: true }, production: true } },
        { summaries: { topics: { id: 2, production: true }, production: true } },
        { summaries: { topics: { id: 3, production: false }, production: true } },
        { summaries: { topics: { id: 4, production: true }, production: false } },
      ];
      const finalCount = [
        {
          topicId: 1,
          count: 1,
          total: 5,
        },
        {
          topicId: 2,
          count: 1,
          total: 10,
        },
      ];

      (
        supabase.from("read_summaries").select("summaries(*, topics(*))").match as jest.Mock
      ).mockReturnValue({
        data: mockData?.filter(
          (data) => data.summaries.production && data.summaries.topics.production,
        ),
        error: null,
      });

      (getSummariesCountByTopic as jest.Mock).mockReturnValue({
        1: 5,
        2: 10,
      });

      const result = await getUserTopicsProgression(userId);

      expect(
        supabase.from("read_summaries").select("summaries(*, topics(*))").match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "summaries.production": true,
        "summaries.topics.production": true,
      });
      expect(result).toEqual(finalCount);
    });

    it("should return an empty array if no topics found", async () => {
      const userId = "user2";
      const mockData: any[] = [];

      (
        supabase.from("read_summaries").select("summaries(*, topics(*))").match as jest.Mock
      ).mockReturnValue({
        data: mockData,
        error: null,
      });

      (getSummariesCountByTopic as jest.Mock).mockReturnValue({});

      const result = await getUserTopicsProgression(userId);

      expect(
        supabase.from("read_summaries").select("summaries(*, topics(*))").match,
      ).toHaveBeenCalledWith({
        user_id: userId,
        "summaries.production": true,
        "summaries.topics.production": true,
      });
      expect(result).toEqual([]);
    });

    it("should throw error if error occured when getting read summaries", async () => {
      const userId = "user1";
      const error = new Error("Error");

      (
        supabase.from("read_summaries").select("summaries(*, topics(*))").match as jest.Mock
      ).mockReturnValue({
        data: null,
        error,
      });

      await expect(getUserTopicsProgression(userId)).rejects.toThrow(
        "Impossible de récupérer la progression des thèmes.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });

    it("should throw error if error occured when getting topics count", async () => {
      const error = new Error("Error");
      const mockData = [{ summaries: { topics: { id: 1 } } }, { summaries: { topics: { id: 2 } } }];

      (
        supabase.from("read_summaries").select("summaries(*, topics(*))").match as jest.Mock
      ).mockReturnValue({
        data: mockData,
        error: null,
      });

      (getSummariesCountByTopic as jest.Mock).mockRejectedValue(error);

      await expect(getUserTopicsProgression as jest.Mock).rejects.toThrow(
        "Impossible de récupérer la progression des thèmes.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("updateProfile", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should update user profile", async () => {
      const username = "user1";
      const biography = "Test";

      (supabase.auth.updateUser as jest.Mock).mockReturnValue({
        error: null,
      });

      const result = await updateProfile(username, biography);

      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        data: {
          name: username,
          biography,
        },
      });
      expect(result).toEqual({ success: true });
    });

    it("should throw error if error occurred", async () => {
      const username = "user1";
      const biography = "Test";
      const error = new Error("Error");

      (supabase.auth.updateUser as jest.Mock).mockReturnValue({
        error,
      });

      await expect(updateProfile(username, biography)).rejects.toThrow(
        "Impossible de mettre à jour le profil.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("saveSummary", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should save summary", async () => {
      const userId = "user1";
      const summaryId = 1;

      (supabase.from("saved_summaries").insert as jest.Mock).mockReturnValue({
        error: null,
      });

      const result = await saveSummary(userId, summaryId);

      expect(supabase.from("saved_summaries").insert).toHaveBeenCalledWith({
        user_id: userId,
        summary_id: summaryId,
      });
      expect(result).toEqual({ success: true });
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const summaryId = 1;
      const error = new Error("Error");

      (supabase.from("saved_summaries").insert as jest.Mock).mockReturnValue({
        error,
      });

      await expect(saveSummary(userId, summaryId)).rejects.toThrow(
        "Impossible de sauvegarder le résumé.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("unsaveSummary", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should unsave summary", async () => {
      const userId = "user1";
      const summaryId = 1;

      (supabase.from("saved_summaries").delete().match as jest.Mock).mockReturnValue({
        error: null,
      });

      const result = await unsaveSummary(userId, summaryId);

      expect(supabase.from("saved_summaries").delete().match).toHaveBeenCalledWith({
        user_id: userId,
        summary_id: summaryId,
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("markSummaryAsRead", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should mark summary as read", async () => {
      const userId = "user1";
      const summaryId = 1;

      (supabase.from("read_summaries").insert as jest.Mock).mockReturnValue({
        error: null,
      });

      const result = await markSummaryAsRead(userId, summaryId);

      expect(supabase.from("read_summaries").insert).toHaveBeenCalledWith({
        user_id: userId,
        summary_id: summaryId,
      });
      expect(result).toEqual({ success: true });
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const summaryId = 1;
      const error = new Error("Error");

      (supabase.from("read_summaries").insert as jest.Mock).mockReturnValue({
        error,
      });

      await expect(markSummaryAsRead(userId, summaryId)).rejects.toThrow(
        "Impossible de marquer le résumé comme lu.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("markSummaryAsUnread", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should mark summary as unread", async () => {
      const userId = "user1";
      const summaryId = 1;

      (supabase.from("read_summaries").delete().match as jest.Mock).mockReturnValue({
        error: null,
      });

      const result = await markSummaryAsUnread(userId, summaryId);

      expect(supabase.from("read_summaries").delete().match).toHaveBeenCalledWith({
        user_id: userId,
        summary_id: summaryId,
      });
      expect(result).toEqual({ success: true });
    });

    it("should throw error if error occurred", async () => {
      const userId = "user1";
      const summaryId = 1;
      const error = new Error("Error");

      (supabase.from("read_summaries").delete().match as jest.Mock).mockReturnValue({
        error,
      });

      await expect(markSummaryAsUnread(userId, summaryId)).rejects.toThrow(
        "Impossible de marquer le résumé comme non lu.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
});
