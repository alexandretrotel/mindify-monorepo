import { renderHook, waitFor } from "@testing-library/react-native";
import useUserSavedSummaries from "@/hooks/global/summaries/useUserSavedSummaries";
import { getUserSavedSummaries } from "@/actions/users.action";

jest.mock("@/actions/users.action", () => ({
  getUserSavedSummaries: jest.fn(),
}));

describe("useUserSavedSummaries", () => {
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUserSavedSummaries(mockUserId));

    expect(result.current.summaries).toEqual([]);
    expect(result.current.orderedSummaries).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it("should fetch user saved summaries successfully", async () => {
    const mockSummaries = [
      {
        id: 1,
        title: "Summary A",
        authors: { id: 1, name: "Author 1" },
        topics: { id: 1, name: "Topic 1" },
      },
      {
        id: 2,
        title: "Summary B",
        authors: { id: 2, name: "Author 2" },
        topics: { id: 2, name: "Topic 2" },
      },
    ];

    (getUserSavedSummaries as jest.Mock).mockResolvedValue(mockSummaries);

    const { result } = renderHook(() => useUserSavedSummaries(mockUserId));

    await waitFor(() => {
      expect(result.current.summaries).toEqual(mockSummaries);
    });
    expect(result.current.orderedSummaries).toEqual(
      mockSummaries.sort((a, b) => a.title.localeCompare(b.title)),
    );
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch user read summaries", async () => {
    const mockError = new Error("Failed to fetch user saved summaries");

    (getUserSavedSummaries as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserSavedSummaries(mockUserId));

    await waitFor(() => {
      expect(result.current.summaries).toEqual([]);
    });
    expect(result.current.orderedSummaries).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
