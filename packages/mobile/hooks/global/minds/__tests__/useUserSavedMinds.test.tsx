import { renderHook, waitFor } from "@testing-library/react-native";
import useUserSavedMinds from "@/hooks/global/minds/useUserSavedMinds";
import { getUserSavedMinds } from "@/actions/users.action";

jest.mock("@/actions/users.action", () => ({
  getUserSavedMinds: jest.fn(),
}));

describe("useUserSavedMinds", () => {
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUserSavedMinds(mockUserId));

    expect(result.current.savedMinds).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it("should fetch saved minds successfully", async () => {
    const mockSavedMinds = [
      {
        id: 1,
        created_at: "2023-01-01T00:00:00Z",
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
      {
        id: 2,
        created_at: "2023-01-02T00:00:00Z",
        text: "Mind 2",
        summaries: {
          id: 2,
          title: "Summary 2",
          authors: {
            id: 2,
            name: "Author 2",
          },
        },
      },
    ];

    (getUserSavedMinds as jest.Mock).mockResolvedValue(mockSavedMinds);

    const { result } = renderHook(() => useUserSavedMinds(mockUserId));

    await waitFor(() => {
      expect(result.current.savedMinds).toEqual(mockSavedMinds.reverse());
    });
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch saved minds", async () => {
    const mockError = new Error("Failed to fetch saved minds");

    (getUserSavedMinds as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserSavedMinds(mockUserId));

    await waitFor(() => {
      expect(result.current.savedMinds).toEqual([]);
    });
    expect(result.current.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
