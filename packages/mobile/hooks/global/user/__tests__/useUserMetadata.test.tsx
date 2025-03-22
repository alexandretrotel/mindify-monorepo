import { renderHook, waitFor } from "@testing-library/react-native";
import useUserMetadata from "@/hooks/global/user/useUserMetadata";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    rpc: jest.fn(() => ({ data: null, error: null })),
  },
}));

describe("useUserMetadata", () => {
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUserMetadata(mockUserId));

    expect(result.current.userMetadata).toBeNull();
  });

  it("should fetch user metadata successfully", async () => {
    const mockData = { name: "John Doe", email: "john.doe@example.com" };
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockData, error: null });

    const { result } = renderHook(() => useUserMetadata(mockUserId));

    await waitFor(() => {
      expect(result.current.userMetadata).toEqual(mockData);
    });
  });

  it("should handle errors during fetch user metadata", async () => {
    const mockError = new Error("Failed to fetch user metadata");
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: mockError });

    const { result } = renderHook(() => useUserMetadata(mockUserId));

    await waitFor(() => {
      expect(result.current.userMetadata).toBeNull();
    });

    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
