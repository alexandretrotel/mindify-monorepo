import { renderHook, waitFor } from "@testing-library/react-native";
import useUserFriendsCount from "@/hooks/global/friends/useUserFriendsCount";
import { getUserFriendsCount } from "@/actions/users.action";

jest.mock("@/actions/users.action", () => ({
  getUserFriendsCount: jest.fn(),
}));

describe("useUserFriendsCount", () => {
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUserFriendsCount(mockUserId));

    expect(result.current.friendsCount).toBe(0);
  });

  it("should fetch user friends count successfully", async () => {
    const mockCount = 5;

    (getUserFriendsCount as jest.Mock).mockResolvedValue(mockCount);

    const { result } = renderHook(() => useUserFriendsCount(mockUserId));

    await waitFor(() => {
      expect(result.current.friendsCount).toBe(mockCount);
    });
  });

  it("should handle errors during fetch user friends count", async () => {
    const mockError = new Error("Failed to fetch user friends count");

    (getUserFriendsCount as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserFriendsCount(mockUserId));

    await waitFor(() => {
      expect(result.current.friendsCount).toBe(0);
    });

    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
