import { renderHook, waitFor } from "@testing-library/react-native";
import useLeaderboard from "@/hooks/features/leaderboard/useLeaderboard";
import { getFriendsLeaderboard, getGlobalLeaderboard } from "@/actions/leaderboard.action";
import { Alert } from "react-native";

jest.mock("@/actions/leaderboard.action", () => ({
  getFriendsLeaderboard: jest.fn(),
  getGlobalLeaderboard: jest.fn(),
}));

describe("useLeaderboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useLeaderboard("user1"));

    expect(result.current.globalLeaderboard).toStrictEqual({
      length: 0,
      leaderboard: [],
    });
    expect(result.current.friendsLeaderboard).toStrictEqual({
      length: 0,
      leaderboard: [],
    });
    expect(result.current.loading).toBe(true);
    expect(result.current.userXP).toBe(0);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.globalUserRank).toBeUndefined();
    expect(result.current.friendsUserRank).toBeUndefined();
    expect(result.current.globalTopRankPercentage).toBeUndefined();
    expect(result.current.friendsTopRankPercentage).toBeUndefined();
  });

  it("should fetch global leaderboard successfully and update the state", async () => {
    const mockGlobalLeaderboard = {
      length: 2,
      leaderboard: [
        { user_id: "user1", xp: 100 },
        { user_id: "user2", xp: 200 },
      ],
    };

    (getGlobalLeaderboard as jest.Mock).mockResolvedValue(mockGlobalLeaderboard);

    const { result } = renderHook(() => useLeaderboard("user1"));

    await waitFor(() => {
      expect(result.current.globalLeaderboard).toEqual(mockGlobalLeaderboard);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.userXP).toBe(100);
  });

  it("should fetch friends leaderboard successfully and update the state", async () => {
    const mockFriendsLeaderboard = {
      length: 2,
      leaderboard: [
        { user_id: "user1", xp: 100 },
        { user_id: "user3", xp: 150 },
      ],
    };

    (getFriendsLeaderboard as jest.Mock).mockResolvedValue(mockFriendsLeaderboard);

    const { result } = renderHook(() => useLeaderboard("user1"));

    await waitFor(() => {
      expect(result.current.friendsLeaderboard).toEqual(mockFriendsLeaderboard);
    });
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch of global leaderboard", async () => {
    const mockError = new Error("mock-error");

    (getGlobalLeaderboard as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useLeaderboard("user1"));

    await waitFor(() => {
      expect(result.current.globalLeaderboard).toStrictEqual({
        length: 0,
        leaderboard: [],
      });
    });
    expect(result.current.loading).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith("Erreur", "Impossible de charger le leaderboard.");
  });

  it("should handle errors during fetch of friends leaderboard", async () => {
    const mockError = new Error("mock-error");

    (getFriendsLeaderboard as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useLeaderboard("user1"));

    await waitFor(() => {
      expect(result.current.friendsLeaderboard).toStrictEqual({
        length: 0,
        leaderboard: [],
      });
    });
    expect(result.current.loading).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Erreur",
      "Impossible de charger le leaderboard des amis.",
    );
  });
});
