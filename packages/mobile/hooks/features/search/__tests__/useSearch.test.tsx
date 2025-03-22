import { renderHook, act, waitFor } from "@testing-library/react-native";
import useSearch from "@/hooks/features/search/useSearch";
import { searchUsers, searchSummaries } from "@/actions/search.action";
import { Alert } from "react-native";

jest.mock("@/actions/search.action", () => ({
  searchUsers: jest.fn(),
  searchSummaries: jest.fn(),
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("useSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useSearch(""));

    expect(result.current.isSearching).toBe(false);
    expect(result.current.searchResults).toEqual({ users: [], summaries: [] });
  });

  it("should perform search successfully", async () => {
    const mockUsers = [{ id: "1", name: "User 1", avatar: "avatar1.png" }];
    const mockSummaries = [
      {
        id: 1,
        title: "Summary 1",
        authors: { id: 1, name: "Author 1" },
      },
    ];

    (searchUsers as jest.Mock).mockResolvedValue(mockUsers);
    (searchSummaries as jest.Mock).mockResolvedValue(mockSummaries);

    const { result } = renderHook(() => useSearch("query"));

    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });
    expect(result.current.searchResults).toEqual({ users: mockUsers, summaries: mockSummaries });
  });

  it("should handle errors during search", async () => {
    const mockError = new Error("Failed to search");

    (searchUsers as jest.Mock).mockRejectedValue(mockError);
    (searchSummaries as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useSearch("query"));

    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });
    expect(result.current.searchResults).toEqual({ users: [], summaries: [] });
    expect(Alert.alert).toHaveBeenCalledWith("Une erreur est survenue lors de la recherche");
  });

  it("should debounce search query", async () => {
    const mockUsers = [{ id: "1", name: "User 1", avatar: "avatar1.png" }];
    const mockSummaries = [
      {
        id: 1,
        title: "Summary 1",
        authors: { id: 1, name: "Author 1" },
      },
    ];

    (searchUsers as jest.Mock).mockResolvedValue(mockUsers);
    (searchSummaries as jest.Mock).mockResolvedValue(mockSummaries);

    const { result } = renderHook(() => useSearch("query"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });
    expect(result.current.searchResults).toEqual({ users: mockUsers, summaries: mockSummaries });
  });
});
