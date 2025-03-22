import { renderHook, act, waitFor } from "@testing-library/react-native";
import useFetchMinds from "@/hooks/features/feed/useFetchMinds";
import { getAllMinds } from "@/actions/minds.action";

jest.mock("@/actions/minds.action", () => ({
  getAllMinds: jest.fn(),
}));

jest.mock("@/constants/assets", () => ({
  assets: {
    videos: ["video1.mp4", "video2.mp4", "video3.mp4"],
  },
}));

describe("useFetchMinds", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useFetchMinds());

    expect(result.current.minds).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.refreshing).toBe(false);
  });

  it("should fetch minds successfully and update the state", async () => {
    const mockMinds = [
      { id: 1, summaries: { topics: {}, authors: {} } },
      { id: 2, summaries: { topics: {}, authors: {} } },
    ];

    (getAllMinds as jest.Mock).mockResolvedValue(mockMinds);

    const { result } = renderHook(() => useFetchMinds());

    await waitFor(() => {
      expect(result.current.minds.length).toBe(2);
    });
    expect(result.current.minds[0].videoAsset).toBe("video1.mp4");
    expect(result.current.minds[1].videoAsset).toBe("video2.mp4");
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch", async () => {
    const mockError = new Error("mock-error");

    (getAllMinds as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFetchMinds());

    await waitFor(() => {
      expect(result.current.minds).toEqual([]);
    });
    expect(result.current.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should handle refresh action correctly", async () => {
    const mockMinds = [
      { id: 1, summaries: { topics: {}, authors: {} } },
      { id: 2, summaries: { topics: {}, authors: {} } },
    ];

    (getAllMinds as jest.Mock).mockResolvedValue(mockMinds);

    const { result } = renderHook(() => useFetchMinds());

    await waitFor(() => {
      expect(result.current.minds.length).toBe(2);
    });
    expect(result.current.minds[0].videoAsset).toBe("video1.mp4");
    expect(result.current.minds[1].videoAsset).toBe("video2.mp4");
    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.onRefresh();
    });

    expect(result.current.refreshing).toBe(true);

    await waitFor(() => {
      expect(result.current.minds.length).toBe(2);
    });
    expect(result.current.minds[0].videoAsset).toBe("video1.mp4");
    expect(result.current.minds[1].videoAsset).toBe("video2.mp4");
    expect(result.current.refreshing).toBe(false);
  });
});
