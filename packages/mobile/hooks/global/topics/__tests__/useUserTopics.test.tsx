import { renderHook, waitFor } from "@testing-library/react-native";
import useUserTopics from "@/hooks/global/topics/useUserTopics";
import { getUserTopics } from "@/actions/users.action";

jest.mock("@/actions/users.action", () => ({
  getUserTopics: jest.fn(),
}));

describe("useUserTopics", () => {
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUserTopics(mockUserId));

    expect(result.current.topics).toEqual([]);
    expect(result.current.orderedTopics).toEqual([]);
  });

  it("should fetch user topics successfully", async () => {
    const mockTopics = [
      { id: 1, name: "Science" },
      { id: 2, name: "Technology" },
    ];

    (getUserTopics as jest.Mock).mockResolvedValue(mockTopics);

    const { result } = renderHook(() => useUserTopics(mockUserId));

    await waitFor(() => {
      expect(result.current.topics).toEqual(mockTopics);
    });

    expect(result.current.orderedTopics).toEqual(
      mockTopics.sort((a, b) => a.name.localeCompare(b.name)),
    );
  });

  it("should handle errors during fetch user topics", async () => {
    const mockError = new Error("Failed to fetch user topics");

    (getUserTopics as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserTopics(mockUserId));

    await waitFor(() => {
      expect(result.current.topics).toEqual([]);
    });

    expect(result.current.orderedTopics).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
