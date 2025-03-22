import { renderHook, waitFor } from "@testing-library/react-native";
import useSummaries from "@/hooks/global/summaries/useSummaries";
import { getBestRatedSummaries, getSummaries } from "@/actions/summaries.action";

jest.mock("@/actions/summaries.action", () => ({
  getSummaries: jest.fn(),
  getBestRatedSummaries: jest.fn(),
}));

describe("useSummaries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useSummaries());

    expect(result.current.summaries).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it("should fetch summaries successfully", async () => {
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

    (getSummaries as jest.Mock).mockResolvedValue(mockSummaries);

    const { result } = renderHook(() => useSummaries());

    await waitFor(() => {
      expect(result.current.summaries).toEqual(
        mockSummaries.sort((a, b) => a.title.localeCompare(b.title)),
      );
    });
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch summaries", async () => {
    const mockError = new Error("Failed to fetch summaries");

    (getSummaries as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useSummaries());

    await waitFor(() => {
      expect(result.current.summaries).toEqual([]);
    });
    expect(result.current.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should fetch best rated summaries successfully", async () => {
    const mockBestRatedSummaries = [
      { id: 1, title: "Summary A" },
      { id: 2, title: "Summary B" },
    ];

    (getBestRatedSummaries as jest.Mock).mockResolvedValue(mockBestRatedSummaries);

    const { result } = renderHook(() => useSummaries());

    await waitFor(() => {
      expect(result.current.bestRatedSummaries).toEqual(mockBestRatedSummaries);
    });
  });

  it("should handle errors during fetch best rated summaries", async () => {
    const mockError = new Error("Failed to fetch best rated summaries");

    (getBestRatedSummaries as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useSummaries());

    await waitFor(() => {
      expect(result.current.bestRatedSummaries).toEqual([]);
    });
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
