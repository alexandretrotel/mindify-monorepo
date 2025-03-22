import { renderHook, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import useUpdateTopics from "@/hooks/features/account/personalization/useUpdateTopics";
import { getTopics } from "@/actions/topics.action";
import { getUserTopics, updateUserTopics } from "@/actions/users.action";
import { useSession } from "@/providers/SessionProvider";

jest.mock("@/actions/topics.action", () => ({
  getTopics: jest.fn(),
}));

jest.mock("@/actions/users.action", () => ({
  getUserTopics: jest.fn(),
  updateUserTopics: jest.fn(),
}));

jest.mock("@/providers/SessionProvider", () => ({
  useSession: jest.fn(),
}));

jest.spyOn(Alert, "alert");

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("useUpdateTopics", () => {
  const mockUserId = "user_123";
  const mockTopics = [
    {
      id: 1,
      name: "Topic 1",
      black_icon: null,
      white_icon: null,
      emoji: null,
      slug: "topic-1",
      created_at: "2021-01-01T00:00:00.000Z",
      production: true,
    },
    {
      id: 2,
      name: "Topic 2",
      black_icon: null,
      white_icon: null,
      emoji: null,
      slug: "topic-2",
      created_at: "2021-01-01T00:00:00.000Z",
      production: true,
    },
  ];
  const mockUserTopics = [
    {
      id: 1,
      name: "Topic 1",
      black_icon: null,
      white_icon: null,
      emoji: null,
      slug: "topic-1",
      created_at: "2021-01-01T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({ userId: mockUserId });
    (getTopics as jest.Mock).mockResolvedValue(mockTopics);
    (getUserTopics as jest.Mock).mockResolvedValue(mockUserTopics);
  });

  it("should fetch topics and user topics on mount", async () => {
    const { result } = renderHook(() => useUpdateTopics());

    await waitFor(() => {
      expect(result.current.topics).toEqual(mockTopics);
    });
    expect(result.current.userTopics).toEqual(mockUserTopics);
    expect(result.current.selectedTopics).toEqual(mockUserTopics);
    expect(result.current.loading).toBe(false);
  });

  it("should handle topic selection", async () => {
    const { result } = renderHook(() => useUpdateTopics());

    await waitFor(() => {
      expect(result.current.topics).toEqual(mockTopics);
    });

    result.current.handleSelection(mockTopics[1]);

    await waitFor(() => {
      expect(result.current.selectedTopics).toEqual([...mockUserTopics, mockTopics[1]]);
    });

    result.current.handleSelection(mockTopics[1]);

    await waitFor(() => {
      expect(result.current.selectedTopics).toEqual(mockUserTopics);
    });
  });

  it("should update user topics", async () => {
    const { result } = renderHook(() => useUpdateTopics());

    await waitFor(() => {
      expect(result.current.topics).toEqual(mockTopics);
    });

    result.current.handleSelection(mockTopics[1]);

    await waitFor(() => {
      expect(result.current.selectedTopics).toEqual([...mockUserTopics, mockTopics[1]]);
    });

    result.current.handleUpdate();

    await waitFor(() => {
      expect(updateUserTopics).toHaveBeenCalledWith(mockUserId, [...mockUserTopics, mockTopics[1]]);
    });
    expect(result.current.userTopics).toEqual([...mockUserTopics, mockTopics[1]]);
    expect(result.current.updating).toBe(false);
  });

  it("should handle errors during fetch", async () => {
    (getTopics as jest.Mock).mockRejectedValue(new Error("Fetch error"));

    const { result } = renderHook(() => useUpdateTopics());

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erreur",
        "Une erreur est survenue lors de la récupération des données",
      );
    });
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during update", async () => {
    (updateUserTopics as jest.Mock).mockRejectedValue(new Error("Update error"));

    const { result } = renderHook(() => useUpdateTopics());

    await waitFor(() => {
      expect(result.current.topics).toEqual(mockTopics);
    });

    result.current.handleSelection(mockTopics[1]);

    await waitFor(() => {
      expect(result.current.selectedTopics).toEqual([...mockUserTopics, mockTopics[1]]);
    });

    result.current.handleUpdate();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour des données",
      );
    });
    expect(result.current.updating).toBe(false);
  });
});
