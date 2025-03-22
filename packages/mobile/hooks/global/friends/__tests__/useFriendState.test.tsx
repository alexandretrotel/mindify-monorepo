import { renderHook, waitFor } from "@testing-library/react-native";
import useFriendState from "@/hooks/global/friends/useFriendState";
import {
  getFriendStatus,
  askForFriend,
  cancelFriendRequest,
  acceptFriendRequest,
  removeFriend,
} from "@/actions/friends.action";
import { useSession } from "@/providers/SessionProvider";
import { Alert } from "react-native";

jest.mock("@/actions/friends.action", () => ({
  getFriendStatus: jest.fn(),
  askForFriend: jest.fn(),
  cancelFriendRequest: jest.fn(),
  acceptFriendRequest: jest.fn(),
  removeFriend: jest.fn(),
}));

jest.mock("@/providers/SessionProvider", () => ({
  useSession: jest.fn(),
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("useFriendState", () => {
  const mockUserId = "user-id";
  const mockFriendId = "friend-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useSession as jest.Mock).mockReturnValue({ userId: mockUserId });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useFriendState(mockFriendId));

    expect(result.current.friendStatus).toBe("none");
  });

  it("should fetch friend status successfully", async () => {
    const mockFriendStatus = "requested";

    (getFriendStatus as jest.Mock).mockResolvedValue(mockFriendStatus);

    const { result } = renderHook(() => useFriendState(mockFriendId));

    await waitFor(() => {
      expect(result.current.friendStatus).toBe(mockFriendStatus);
    });
  });

  it("should handle errors during fetch friend status", async () => {
    const mockError = new Error("Failed to fetch friend status");

    (getFriendStatus as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFriendState(mockFriendId));

    await waitFor(() => {
      expect(result.current.friendStatus).toBe("none");
    });

    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should handle asking for friend", async () => {
    const { result } = renderHook(() => useFriendState(mockFriendId));

    result.current.handleAskFriend(mockFriendId, "none");

    expect(askForFriend).toHaveBeenCalledWith(mockUserId, mockFriendId);
    await waitFor(() => {
      expect(result.current.friendStatus).toBe("pending");
    });
  });

  it("should handle canceling friend request", async () => {
    const { result } = renderHook(() => useFriendState(mockFriendId));

    Alert.alert = jest.fn((title, message, buttons) => {
      if (buttons?.[1]?.onPress) {
        buttons?.[1]?.onPress();
      }
    });

    result.current.handleAskFriend(mockFriendId, "pending");

    expect(cancelFriendRequest).toHaveBeenCalledWith(mockUserId, mockFriendId);
    await waitFor(() => {
      expect(result.current.friendStatus).toBe("none");
    });
  });

  it("should handle accepting friend request", async () => {
    const { result } = renderHook(() => useFriendState(mockFriendId));

    result.current.handleAskFriend(mockFriendId, "requested");

    expect(acceptFriendRequest).toHaveBeenCalledWith(mockUserId, mockFriendId);
    await waitFor(() => {
      expect(result.current.friendStatus).toBe("accepted");
    });
  });

  it("should handle removing friend", async () => {
    const { result } = renderHook(() => useFriendState(mockFriendId));

    Alert.alert = jest.fn((title, message, buttons) => {
      if (buttons?.[1]?.onPress) {
        buttons[1].onPress();
      }
    });

    result.current.handleAskFriend(mockFriendId, "accepted");

    expect(removeFriend).toHaveBeenCalledWith(mockUserId, mockFriendId);
    await waitFor(() => {
      expect(result.current.friendStatus).toBe("none");
    });
  });

  it("should handle errors during friend actions", async () => {
    const mockError = new Error("Failed to perform action");

    (askForFriend as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFriendState(mockFriendId));

    result.current.handleAskFriend(mockFriendId, "none");

    expect(askForFriend).toHaveBeenCalledWith(mockUserId, mockFriendId);
    await waitFor(() => {
      expect(result.current.friendStatus).toBe("none");
    });
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
