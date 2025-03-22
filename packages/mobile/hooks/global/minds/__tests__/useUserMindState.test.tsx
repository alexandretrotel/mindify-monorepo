import { renderHook, waitFor } from "@testing-library/react-native";
import useUserMindState from "@/hooks/global/minds/useUserMindState";
import {
  getLikedMindCount,
  getSavedMindCount,
  isMindLiked,
  isMindSaved,
} from "@/actions/minds.action";

jest.mock("@/actions/minds.action", () => ({
  getLikedMindCount: jest.fn(),
  getSavedMindCount: jest.fn(),
  isMindLiked: jest.fn(),
  isMindSaved: jest.fn(),
}));

describe("useUserMindState", () => {
  const mockMindId = 1;
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUserMindState(mockMindId, mockUserId));

    expect(result.current.likedMind).toBe(false);
    expect(result.current.savedMind).toBe(false);
    expect(result.current.likedMindCount).toBe(0);
    expect(result.current.savedMindCount).toBe(0);
  });

  it("should fetch mind states successfully", async () => {
    const mockLiked = true;
    const mockSaved = true;
    const mockLikedCount = 10;
    const mockSavedCount = 5;

    (isMindLiked as jest.Mock).mockResolvedValue(mockLiked);
    (isMindSaved as jest.Mock).mockResolvedValue(mockSaved);
    (getLikedMindCount as jest.Mock).mockResolvedValue(mockLikedCount);
    (getSavedMindCount as jest.Mock).mockResolvedValue(mockSavedCount);

    const { result } = renderHook(() => useUserMindState(mockMindId, mockUserId));

    await waitFor(() => {
      expect(result.current.likedMind).toBe(mockLiked);
    });

    expect(result.current.savedMind).toBe(mockSaved);
    expect(result.current.likedMindCount).toBe(mockLikedCount);
    expect(result.current.savedMindCount).toBe(mockSavedCount);
  });

  it("should handle errors during fetch mind states", async () => {
    const mockError = new Error("Failed to fetch mind states");

    (isMindLiked as jest.Mock).mockRejectedValue(mockError);
    (isMindSaved as jest.Mock).mockRejectedValue(mockError);
    (getLikedMindCount as jest.Mock).mockRejectedValue(mockError);
    (getSavedMindCount as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserMindState(mockMindId, mockUserId));

    await waitFor(() => {
      expect(result.current.likedMind).toBe(false);
    });

    expect(result.current.savedMind).toBe(false);
    expect(result.current.likedMindCount).toBe(0);
    expect(result.current.savedMindCount).toBe(0);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
