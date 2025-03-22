import { renderHook, waitFor } from "@testing-library/react-native";
import useSummary from "@/hooks/global/summaries/useSummary";
import { getSummary } from "@/actions/summaries.action";

jest.mock("@/actions/summaries.action", () => ({
  getSummary: jest.fn(),
}));

describe("useSummary", () => {
  const mockSummaryId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useSummary(mockSummaryId));

    expect(result.current.summary).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it("should fetch summary successfully", async () => {
    const mockSummary = {
      id: 1,
      title: "Summary A",
      authors: { id: 1, name: "Author 1" },
      topics: { id: 1, name: "Topic 1" },
      chapters: { id: 1, title: "Chapter 1" },
    };

    (getSummary as jest.Mock).mockResolvedValue(mockSummary);

    const { result } = renderHook(() => useSummary(mockSummaryId));

    await waitFor(() => {
      expect(result.current.summary).toEqual(mockSummary);
    });
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch summary", async () => {
    const mockError = new Error("Failed to fetch summary");

    (getSummary as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useSummary(mockSummaryId));

    await waitFor(() => {
      expect(result.current.summary).toBeNull();
    });
    expect(result.current.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith("Error fetching summary:", mockError);
  });
});
