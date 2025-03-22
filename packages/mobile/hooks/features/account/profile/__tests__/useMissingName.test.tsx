import { act, renderHook, waitFor } from "@testing-library/react-native";
import useMissingName from "@/hooks/features/account/profile/useMissingName";
import { useSession } from "@/providers/SessionProvider";

jest.mock("@/providers/SessionProvider", () => ({
  useSession: jest.fn(),
}));

describe("useMissingName", () => {
  let mockHandleAddName: jest.Mock;

  beforeEach(() => {
    mockHandleAddName = jest.fn();
    (useSession as jest.Mock).mockReturnValue({
      handleAddName: mockHandleAddName,
    });
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should initialize with default values", () => {
    const { result } = renderHook(() => useMissingName());

    expect(result.current.name).toBe("");
    expect(result.current.disabled).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  test("should enable the button when name is more than 3 characters", async () => {
    const { result } = renderHook(() => useMissingName());

    result.current.setName("John");

    await waitFor(() => {
      expect(result.current.disabled).toBe(false);
    });
  });

  test("should call handleAddName when handleAddMissingName is called", async () => {
    const { result } = renderHook(() => useMissingName());

    await act(() => {
      result.current.setName("John");
    });

    await waitFor(() => {
      expect(result.current.disabled).toBe(false);
    });

    result.current.handleAddMissingName();

    await waitFor(() => {
      expect(mockHandleAddName).toHaveBeenCalledWith("John");
    });
  });

  test("should disable the button when name is 3 characters or less", async () => {
    const { result } = renderHook(() => useMissingName());

    result.current.setName("Jo");

    await waitFor(() => {
      expect(result.current.disabled).toBe(true);
    });
  });

  test("should call setFriendsModalVisible if provided and name is added", async () => {
    const mockSetFriendsModalVisible = jest.fn();
    const { result } = renderHook(() => useMissingName(mockSetFriendsModalVisible));

    result.current.setName("John");

    result.current.handleAddMissingName();

    await waitFor(() => {
      expect(mockSetFriendsModalVisible).toHaveBeenCalledWith(false);
    });
  });

  test("should not call setFriendsModalVisible if not provided", async () => {
    const { result } = renderHook(() => useMissingName());

    result.current.setName("John");

    await waitFor(() => {
      expect(() => result.current.handleAddMissingName()).not.toThrow();
    });

    result.current.handleAddMissingName();

    await waitFor(() => {
      expect(mockHandleAddName).toHaveBeenCalledWith("John");
    });
  });

  test("should handle errors in handleAddMissingName", async () => {
    const { result } = renderHook(() => useMissingName());

    mockHandleAddName.mockRejectedValueOnce(new Error("Some error"));

    await act(() => {
      result.current.setName("John");
    });

    await waitFor(() => {
      expect(() => result.current.handleAddMissingName()).not.toThrow();
    });

    expect(console.error).toHaveBeenCalledWith(new Error("Some error"));
  });
});
