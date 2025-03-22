import { renderHook, waitFor } from "@testing-library/react-native";
import useUserFriends from "@/hooks/global/friends/useUserFriends";
import { getUserFriends } from "@/actions/users.action";

jest.mock("@/actions/users.action", () => ({
  getUserFriends: jest.fn(),
}));

describe("useUserFriends", () => {
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUserFriends(mockUserId));

    expect(result.current.friends).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it("should fetch user friends successfully", async () => {
    const mockFriends = [
      { id: "1", name: "Friend 1", avatar: "avatar1.png" },
      { id: "2", name: "Friend 2", avatar: "avatar2.png" },
    ];

    (getUserFriends as jest.Mock).mockResolvedValue(mockFriends);

    const { result } = renderHook(() => useUserFriends(mockUserId));

    await waitFor(() => {
      expect(result.current.friends).toEqual(mockFriends);
    });
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch user friends", async () => {
    const mockError = new Error("Failed to fetch user friends");

    (getUserFriends as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserFriends(mockUserId));

    await waitFor(() => {
      expect(result.current.friends).toEqual([]);
    });
    expect(result.current.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
