import { renderHook, waitFor } from "@testing-library/react-native";
import useProfileMetadata from "@/hooks/global/user/useProfileMetadata";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/providers/SessionProvider";
import { getAvatar } from "@/utils/avatars";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    rpc: jest.fn(),
  },
}));

jest.mock("@/providers/SessionProvider", () => ({
  useSession: jest.fn(),
}));

jest.mock("@/utils/avatars", () => ({
  getAvatar: jest.fn(),
}));

describe("useProfileMetadata", () => {
  const mockProfileId = "profile-id";
  const mockSession = { user: { id: "user-id" } };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useSession as jest.Mock).mockReturnValue({ session: mockSession });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useProfileMetadata(mockProfileId));

    expect(result.current.loading).toBe(true);
    expect(result.current.username).toBe("");
    expect(result.current.avatarURL).toBeNull();
    expect(result.current.biography).toBe("");
    expect(result.current.refreshing).toBe(false);
  });

  it("should fetch user metadata successfully", async () => {
    const mockData = { name: "John Doe", biography: "Bio" };
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockData, error: null });
    (getAvatar as jest.Mock).mockReturnValue("avatar-url");

    const { result } = renderHook(() => useProfileMetadata(mockProfileId));

    await waitFor(() => {
      expect(result.current.username).toBe("John Doe");
    });
    expect(result.current.biography).toBe("Bio");
    expect(result.current.avatarURL).toBe("avatar-url");
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch user metadata", async () => {
    const mockError = new Error("Erreur de chargement du profil");
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: mockError });

    const { result } = renderHook(() => useProfileMetadata(mockProfileId));

    await waitFor(() => {
      expect(result.current.username).toBe("");
    });
    expect(result.current.biography).toBe("");
    expect(result.current.avatarURL).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should refresh user metadata successfully", async () => {
    const mockData = { name: "John Doe", biography: "Bio" };
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockData, error: null });
    (getAvatar as jest.Mock).mockReturnValue("avatar-url");

    const { result } = renderHook(() => useProfileMetadata(mockProfileId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    result.current.onRefresh();

    await waitFor(() => {
      expect(result.current.username).toBe("John Doe");
    });
    expect(result.current.biography).toBe("Bio");
    expect(result.current.avatarURL).toBe("avatar-url");
    expect(result.current.refreshing).toBe(false);
  });
});
