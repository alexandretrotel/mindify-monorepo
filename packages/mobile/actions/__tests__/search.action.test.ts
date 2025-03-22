import { supabase } from "@/lib/supabase";
import { searchSummaries, searchUsers } from "@/actions/search.action";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    rpc: jest.fn(),
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("Search actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("searchUsers", () => {
    it("should returns the researched users", async () => {
      const foundUsers = [{ id: "user1", name: "John Doe", avatar: "avatar1.png" }];

      (supabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: foundUsers,
        error: null,
      });

      const result = await searchUsers("John Doe");

      expect(supabase.rpc).toHaveBeenCalledWith("search_users", { search_query: "John Doe" });
      expect(result).toEqual(foundUsers);
    });

    it("should handle the error if the searchUsers request fails", async () => {
      const error = new Error("Error searching users");
      (supabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: null,
        error,
      });

      const result = await searchUsers("John Doe");

      expect(supabase.rpc).toHaveBeenCalledWith("search_users", { search_query: "John Doe" });
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Error searching users:", error);
    });
  });

  describe("searchSummaries", () => {
    it("should returns the researched summaries", async () => {
      const foundSummaries = [
        {
          id: 1,
          title: "Summary 1",
          authors: { id: 1, name: "Author 1" },
          production: true,
        },
        {
          id: 2,
          title: "Summary 2",
          authors: { id: 2, name: "Author 2" },
          production: false,
        },
      ];

      (
        supabase.from("summaries").select("*, authors(*)").textSearch("title", "Summary 1", {
          type: "websearch",
        }).eq as jest.Mock
      ).mockResolvedValueOnce({
        data: foundSummaries?.filter((summary) => summary.production),
        error: null,
      });

      const result = await searchSummaries("Summary 1");

      expect(
        supabase.from("summaries").select("*, authors(*)").textSearch("title", "Summary 1", {
          type: "websearch",
        }).eq,
      ).toHaveBeenCalledWith("production", true);
      expect(result).toEqual(foundSummaries?.filter((summary) => summary.production));
    });

    it("should handle the error if the searchSummaries request fails", async () => {
      const error = new Error("Error searching summaries");
      (
        supabase.from("summaries").select("*, authors(*)").textSearch("title", "Summary 1", {
          type: "websearch",
        }).eq as jest.Mock
      ).mockResolvedValueOnce({
        data: null,
        error,
      });

      const result = await searchSummaries("Summary 1");

      expect(
        supabase.from("summaries").select("*, authors(*)").textSearch("title", "Summary 1", {
          type: "websearch",
        }).eq,
      ).toHaveBeenCalledWith("production", true);
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Error searching summaries:", error);
    });
  });
});
