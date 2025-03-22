import { renderHook, waitFor } from "@testing-library/react-native";
import useDeleteAccount from "@/hooks/features/account/security/useDeleteAccount";
import { deleteUser } from "@/actions/auth.action";
import { useSession } from "@/providers/SessionProvider";
import { Alert } from "react-native";

jest.mock("@/actions/auth.action", () => ({
  deleteUser: jest.fn(),
}));

jest.mock("@/providers/SessionProvider", () => ({
  useSession: jest.fn(),
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("useDeleteAccount", () => {
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useSession as jest.Mock).mockReturnValue({ userId: mockUserId });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useDeleteAccount());

    expect(result.current.isUpdating).toBe(false);
  });

  it("should handle account deletion successfully", async () => {
    (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
      buttons?.[1].onPress();
    });

    const { result } = renderHook(() => useDeleteAccount());

    result.current.handleDeleteAccount();

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith(mockUserId);
    });
    expect(result.current.isUpdating).toBe(false);
  });

  it("should handle errors during account deletion", async () => {
    const mockError = new Error("Failed to delete account");
    (deleteUser as jest.Mock).mockRejectedValue(mockError);
    (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
      buttons?.[1].onPress();
    });

    const { result } = renderHook(() => useDeleteAccount());

    result.current.handleDeleteAccount();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Une erreur est survenue lors de la suppression du compte",
      );
    });
    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(result.current.isUpdating).toBe(false);
  });

  it("should not delete account if userId is not available", async () => {
    (useSession as jest.Mock).mockReturnValue({ userId: null });
    const { result } = renderHook(() => useDeleteAccount());

    result.current.handleDeleteAccount();

    expect(deleteUser).not.toHaveBeenCalled();
  });
});
