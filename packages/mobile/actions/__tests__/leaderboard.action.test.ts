import { supabase } from "@/lib/supabase";
import { getFriendsLeaderboard, getGlobalLeaderboard } from "@/actions/leaderboard.action";
import { getFriendsIds } from "@/actions/friends.action";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
    select: jest.fn(),
    order: jest.fn(),
  },
}));

jest.mock("@/actions/friends.action", () => ({
  getFriendsIds: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("Leaderboard Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGlobalLeaderboard", () => {
    it("should return the global leaderboard ranking all users by their XP", async () => {
      const mockData = [
        { user_id: "user1", xp: 100 },
        { user_id: "user2", xp: 50 },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            data: mockData,
            error: null,
          }),
        }),
      });

      const data = await getGlobalLeaderboard();

      expect(data).toEqual({
        length: 2,
        leaderboard: mockData,
      });
    });

    it("should throw an error if there was an error retrieving the leaderboard", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            data: null,
            error: "Error",
          }),
        }),
      });

      await expect(getGlobalLeaderboard()).rejects.toThrow(
        "Impossible de récupérer le leaderboard.",
      );
    });
  });

  describe("getFriendsLeaderboard", () => {
    it("should return the friends leaderboard ranking all friends by their XP and the user's XP", async () => {
      const mockFriendsIds = ["user2", "user3"];
      const mockData = [
        { user_id: "user1", xp: 100 },
        { user_id: "user2", xp: 50 },
        { user_id: "user3", xp: 75 },
      ];

      (getFriendsIds as jest.Mock).mockResolvedValue({
        friendsIds: mockFriendsIds,
      });
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              data: mockData,
              error: null,
            }),
          }),
        }),
      });

      const data = await getFriendsLeaderboard("user1");

      expect(data).toEqual({
        length: 3,
        leaderboard: mockData,
      });
    });

    it("should throw an error if there was an error retrieving the user's friends", async () => {
      (getFriendsIds as jest.Mock).mockRejectedValue(new Error("Error"));

      await expect(getFriendsLeaderboard("user1")).rejects.toThrow(
        "Impossible de récupérer la liste des amis.",
      );
    });

    it("should throw an error if there was an error retrieving the friends leaderboard", async () => {
      const mockFriendsIds = ["user2", "user4"];

      (getFriendsIds as jest.Mock).mockResolvedValue({
        friendsIds: mockFriendsIds,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              data: null,
              error: "Error",
            }),
          }),
        }),
      });

      await expect(getFriendsLeaderboard("user1")).rejects.toThrow(
        "Impossible de récupérer le leaderboard des amis.",
      );
    });
  });
});
