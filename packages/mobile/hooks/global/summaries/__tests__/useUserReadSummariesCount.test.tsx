import { renderHook, waitFor } from "@testing-library/react-native";
import useUserReadSummariesCount from "@/hooks/global/summaries/useUserReadSummariesCount";
import { getUserReadSummariesCount } from "@/actions/users.action";

jest.mock("@/actions/users.action", () => ({
  getUserReadSummariesCount: jest.fn(),
}));

describe("useUserReadSummariesCount", () => {
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUserReadSummariesCount(mockUserId));

    expect(result.current.readSummariesCount).toBe(0);
  });

  it("should fetch user read summaries count successfully", async () => {
    const mockCount = 5;

    (getUserReadSummariesCount as jest.Mock).mockResolvedValue(mockCount);

    const { result } = renderHook(() => useUserReadSummariesCount(mockUserId));

    await waitFor(() => {
      expect(result.current.readSummariesCount).toBe(mockCount);
    });
  });

  it("should handle errors during fetch user read summaries count", async () => {
    const mockError = new Error("Failed to fetch user read summaries count");

    (getUserReadSummariesCount as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserReadSummariesCount(mockUserId));

    await waitFor(() => {
      expect(result.current.readSummariesCount).toBe(0);
    });

    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
