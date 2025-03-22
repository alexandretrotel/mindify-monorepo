import { renderHook, waitFor } from "@testing-library/react-native";
import useUserTopicsProgression from "@/hooks/global/user/useUserTopicsProgression";
import { getUserTopicsProgression } from "@/actions/users.action";

jest.mock("@/actions/users.action", () => ({
  getUserTopicsProgression: jest.fn(),
}));

describe("useUserTopicsProgression", () => {
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUserTopicsProgression(mockUserId));

    expect(result.current.loading).toBe(true);
    expect(result.current.topicsProgression).toEqual([]);
  });

  it("should fetch user topics progression data successfully", async () => {
    const mockData = [
      { topicId: 1, count: 5, total: 10 },
      { topicId: 2, count: 3, total: 8 },
    ];
    (getUserTopicsProgression as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useUserTopicsProgression(mockUserId));

    await waitFor(() => {
      expect(result.current.topicsProgression).toEqual(mockData);
    });
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch user topics progression data", async () => {
    const mockError = new Error("Failed to fetch user topics progression data");
    (getUserTopicsProgression as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserTopicsProgression(mockUserId));

    await waitFor(() => {
      expect(result.current.topicsProgression).toEqual([]);
    });
    expect(result.current.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
