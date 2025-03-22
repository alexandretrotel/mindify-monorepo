import { renderHook, waitFor } from "@testing-library/react-native";
import useSummariesByTopicId from "@/hooks/global/summaries/useSummariesByTopicId";
import { getSummariesByTopicId } from "@/actions/summaries.action";
import { Alert } from "react-native";

jest.mock("@/actions/summaries.action", () => ({
  getSummariesByTopicId: jest.fn(),
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("useSummariesByTopicId", () => {
  const mockTopicId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useSummariesByTopicId(mockTopicId));

    expect(result.current.summaries).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it("should fetch summaries by topic ID successfully", async () => {
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

    (getSummariesByTopicId as jest.Mock).mockResolvedValue(mockSummaries);

    const { result } = renderHook(() => useSummariesByTopicId(mockTopicId));

    await waitFor(() => {
      expect(result.current.summaries).toEqual(mockSummaries);
    });
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch summaries by topic ID", async () => {
    const mockError = new Error("Failed to fetch summaries");

    (getSummariesByTopicId as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useSummariesByTopicId(mockTopicId));

    await waitFor(() => {
      expect(result.current.summaries).toEqual([]);
    });
    expect(result.current.loading).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Une erreur est survenue lors de la récupération des résumés",
    );
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
