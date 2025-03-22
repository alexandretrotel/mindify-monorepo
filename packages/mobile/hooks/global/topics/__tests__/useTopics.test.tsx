import { renderHook, waitFor } from "@testing-library/react-native";
import useTopics from "@/hooks/global/topics/useTopics";
import { getTopics, getSummariesCountByTopic } from "@/actions/topics.action";
import { Alert } from "react-native";

jest.mock("@/actions/topics.action", () => ({
  getTopics: jest.fn(),
  getSummariesCountByTopic: jest.fn(),
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("useTopics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useTopics());

    expect(result.current.loading).toBe(true);
    expect(result.current.topics).toEqual([]);
    expect(result.current.summariesCountByTopic).toEqual({});
    expect(result.current.orderedTopics).toEqual([]);
  });

  it("should fetch topics successfully", async () => {
    const mockTopics = [
      { id: 1, name: "Science" },
      { id: 2, name: "Technology" },
    ];

    (getTopics as jest.Mock).mockResolvedValue(mockTopics);

    const { result } = renderHook(() => useTopics());

    await waitFor(() => {
      expect(result.current.topics).toEqual(
        mockTopics.sort((a, b) => a.name.localeCompare(b.name)),
      );
    });
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch topics", async () => {
    const mockError = new Error("Failed to fetch topics");

    (getTopics as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useTopics());

    await waitFor(() => {
      expect(result.current.topics).toEqual([]);
    });
    expect(result.current.loading).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Une erreur est survenue lors de la récupération des thèmes",
    );
    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should fetch summaries count by topic successfully", async () => {
    const mockSummariesCount = { 1: 10, 2: 5 };

    (getSummariesCountByTopic as jest.Mock).mockResolvedValue(mockSummariesCount);

    const { result } = renderHook(() => useTopics());

    await waitFor(() => {
      expect(result.current.summariesCountByTopic).toEqual(mockSummariesCount);
    });
  });

  it("should handle errors during fetch summaries count by topic", async () => {
    const mockError = new Error("Failed to fetch summaries count by topic");

    (getSummariesCountByTopic as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useTopics());

    await waitFor(() => {
      expect(result.current.summariesCountByTopic).toEqual({});
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      "Une erreur est survenue lors de la récupération des thèmes",
    );
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
