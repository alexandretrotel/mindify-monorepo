import { renderHook, act } from "@testing-library/react-native";
import useChangePassword from "@/hooks/features/account/security/useChangePassword";
import { updatePassword } from "@/actions/auth.action";
import { Alert } from "react-native";

jest.mock("@/actions/auth.action", () => ({
  updatePassword: jest.fn(),
}));

describe("useChangePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useChangePassword());

    expect(result.current.newPassword).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.isUpdating).toBe(false);
  });

  it("should not update password if newPassword and confirmPassword do not match", async () => {
    const { result } = renderHook(() => useChangePassword());

    act(() => {
      result.current.setNewPassword("password123");
      result.current.setConfirmPassword("password456");
    });

    await act(async () => {
      await result.current.handleChangePassword();
    });

    expect(updatePassword).not.toHaveBeenCalled();
    expect(result.current.isUpdating).toBe(false);
  });

  it("should update password successfully", async () => {
    (updatePassword as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useChangePassword());

    act(() => {
      result.current.setNewPassword("password123");
      result.current.setConfirmPassword("password123");
    });

    await act(async () => {
      await result.current.handleChangePassword();
    });

    expect(updatePassword).toHaveBeenCalledWith("password123", "password123");
    expect(Alert.alert).toHaveBeenCalledWith("Succès", "Mot de passe changé avec succès.");
    expect(result.current.isUpdating).toBe(false);
  });

  it("should handle errors during password update", async () => {
    const mockError = new Error("mock-error");
    (updatePassword as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useChangePassword());

    act(() => {
      result.current.setNewPassword("password123");
      result.current.setConfirmPassword("password123");
    });

    await act(async () => {
      await result.current.handleChangePassword();
    });

    expect(updatePassword).toHaveBeenCalledWith("password123", "password123");
    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(Alert.alert).toHaveBeenCalledWith("Erreur", "Impossible de changer le mot de passe.");
    expect(result.current.isUpdating).toBe(false);
  });
});
