import { renderHook, waitFor } from "@testing-library/react-native";
import useUserLevel from "@/hooks/global/user/useUserLevel";
import { getUserLevel } from "@/actions/level.action";

jest.mock("@/actions/level.action", () => ({
  getUserLevel: jest.fn(),
}));

describe("useUserLevel", () => {
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUserLevel(mockUserId));

    expect(result.current.xp).toBe(0);
    expect(result.current.level).toBe(0);
    expect(result.current.loading).toBe(true);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.xpForNextLevel).toBe(0);
    expect(result.current.xpForCurrentLevel).toBe(0);
    expect(result.current.progression).toBe(0);
  });

  it("should fetch user level data successfully", async () => {
    const mockData = {
      xp: 100,
      level: 2,
      xp_for_next_level: 200,
      xp_of_current_level: 50,
      progression: 0.5,
    };
    (getUserLevel as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useUserLevel(mockUserId));

    await waitFor(() => {
      expect(result.current.xp).toBe(mockData.xp);
    });
    expect(result.current.level).toBe(mockData.level);
    expect(result.current.xpForNextLevel).toBe(mockData.xp_for_next_level);
    expect(result.current.xpForCurrentLevel).toBe(mockData.xp_of_current_level);
    expect(result.current.progression).toBe(mockData.progression);
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch user level data", async () => {
    const mockError = new Error("Failed to fetch user level data");
    (getUserLevel as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserLevel(mockUserId));

    await waitFor(() => {
      expect(result.current.xp).toBe(0);
    });
    expect(result.current.level).toBe(0);
    expect(result.current.xpForNextLevel).toBe(0);
    expect(result.current.xpForCurrentLevel).toBe(0);
    expect(result.current.progression).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should refresh user level data successfully", async () => {
    const mockData = {
      xp: 100,
      level: 2,
      xp_for_next_level: 200,
      xp_of_current_level: 50,
      progression: 0.5,
    };
    (getUserLevel as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useUserLevel(mockUserId));

    await waitFor(() => {
      expect(result.current.xp).toBe(mockData.xp);
    });

    result.current.onRefresh();

    await waitFor(() => {
      expect(result.current.xp).toBe(mockData.xp);
    });
    expect(result.current.level).toBe(mockData.level);
    expect(result.current.xpForNextLevel).toBe(mockData.xp_for_next_level);
    expect(result.current.xpForCurrentLevel).toBe(mockData.xp_of_current_level);
    expect(result.current.progression).toBe(mockData.progression);
    expect(result.current.refreshing).toBe(false);
  });
});
