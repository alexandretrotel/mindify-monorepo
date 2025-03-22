import { renderHook, act } from "@testing-library/react-native";
import useUpdateProfile from "@/hooks/features/account/profile/useUpdateProfile";
import { updateProfile } from "@/actions/users.action";
import { useSession } from "@/providers/SessionProvider";
import { Alert } from "react-native";

jest.mock("@/actions/users.action", () => ({
  updateProfile: jest.fn(),
}));

jest.mock("@/providers/SessionProvider", () => ({
  useSession: jest.fn(),
}));

jest.mock("@/utils/avatars", () => ({
  getAvatar: jest.fn().mockReturnValue("mock-avatar-url"),
}));

describe("useUpdateProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    (useSession as jest.Mock).mockReturnValue({
      userMetadata: null,
    });

    const { result } = renderHook(() => useUpdateProfile());

    expect(result.current.initialUsername).toBe("");
    expect(result.current.username).toBe("");
    expect(result.current.initialBiography).toBe("");
    expect(result.current.biography).toBe("");
    expect(result.current.canUpdate).toBe(false);
    expect(result.current.updating).toBe(false);
    expect(result.current.avatar).toBe("mock-avatar-url");
    expect(result.current.email).toBeUndefined();
  });

  it("should update state when userMetadata changes", () => {
    const mockUserMetadata = {
      name: "John Doe",
      biography: "This is a biography",
      email: "john.doe@example.com",
    };

    (useSession as jest.Mock).mockReturnValue({
      userMetadata: mockUserMetadata,
    });

    const { result } = renderHook(() => useUpdateProfile());

    expect(result.current.initialUsername).toBe("John Doe");
    expect(result.current.username).toBe("John Doe");
    expect(result.current.initialBiography).toBe("This is a biography");
    expect(result.current.biography).toBe("This is a biography");
    expect(result.current.email).toBe("john.doe@example.com");
  });

  it("should update canUpdate state when username or biography changes", () => {
    const mockUserMetadata = {
      name: "John Doe",
      biography: "This is a biography",
    };

    (useSession as jest.Mock).mockReturnValue({
      userMetadata: mockUserMetadata,
    });

    const { result } = renderHook(() => useUpdateProfile());

    act(() => {
      result.current.handleChangeUsername("Jane Doe");
    });

    expect(result.current.canUpdate).toBe(true);

    act(() => {
      result.current.handleChangeBiography("New biography");
    });

    expect(result.current.canUpdate).toBe(true);
  });

  it("should handle profile update correctly", async () => {
    const mockUserMetadata = {
      name: "John Doe",
      biography: "This is a biography",
    };

    (useSession as jest.Mock).mockReturnValue({
      userMetadata: mockUserMetadata,
    });

    (updateProfile as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useUpdateProfile());

    act(() => {
      result.current.handleChangeUsername("Jane Doe");
      result.current.handleChangeBiography("New biography");
    });

    await act(async () => {
      await result.current.handleUpdateProfile();
    });

    expect(updateProfile).toHaveBeenCalledWith("Jane Doe", "New biography");
    expect(result.current.initialUsername).toBe("Jane Doe");
    expect(result.current.initialBiography).toBe("New biography");
    expect(result.current.updating).toBe(false);
  });

  it("should handle errors during profile update", async () => {
    const mockUserMetadata = {
      name: "John Doe",
      biography: "This is a biography",
    };

    const mockError = new Error("mock-error");

    (useSession as jest.Mock).mockReturnValue({
      userMetadata: mockUserMetadata,
    });

    (updateProfile as jest.Mock).mockRejectedValue(mockError);

    jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { result } = renderHook(() => useUpdateProfile());

    act(() => {
      result.current.handleChangeUsername("Jane Doe");
      result.current.handleChangeBiography("New biography");
    });

    await act(async () => {
      await result.current.handleUpdateProfile();
    });

    expect(updateProfile).toHaveBeenCalledWith("Jane Doe", "New biography");
    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Une erreur est survenue lors de la mise à jour du profil",
    );
    expect(result.current.updating).toBe(false);
  });
});
