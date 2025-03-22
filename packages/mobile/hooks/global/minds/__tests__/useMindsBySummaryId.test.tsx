import { renderHook, waitFor } from "@testing-library/react-native";
import useMindsBySummaryId from "@/hooks/global/minds/useMindsBySummaryId";
import { getMindsBySummaryId } from "@/actions/minds.action";
import { Alert } from "react-native";

jest.mock("@/actions/minds.action", () => ({
  getMindsBySummaryId: jest.fn(),
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("useMindsBySummaryId", () => {
  const mockSummaryId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useMindsBySummaryId(mockSummaryId));

    expect(result.current.minds).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it("should fetch minds by summary ID successfully", async () => {
    const mockMinds = [
      {
        id: 1,
        text: "Mind 1",
        summaries: {
          id: 1,
          title: "Summary 1",
          authors: {
            id: 1,
            name: "Author 1",
          },
        },
      },
    ];

    (getMindsBySummaryId as jest.Mock).mockResolvedValue(mockMinds);

    const { result } = renderHook(() => useMindsBySummaryId(mockSummaryId));

    await waitFor(() => {
      expect(result.current.minds).toEqual(mockMinds);
    });
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch minds by summary ID", async () => {
    const mockError = new Error("Failed to fetch minds");

    (getMindsBySummaryId as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useMindsBySummaryId(mockSummaryId));

    await waitFor(() => {
      expect(result.current.minds).toEqual([]);
    });
    expect(result.current.loading).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith("Erreur", "Une erreur est survenue.");
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
