import { renderHook, waitFor } from "@testing-library/react-native";
import useFetchCards from "@/hooks/features/learn/useFetchCards";
import { getUserSavedMinds, getUserSrsData } from "@/actions/users.action";
import { useSession } from "@/providers/SessionProvider";
import { State } from "ts-fsrs";
import { Alert } from "react-native";

jest.mock("@/actions/users.action", () => ({
  getUserSavedMinds: jest.fn(),
  getUserSrsData: jest.fn(),
}));

jest.mock("@/providers/SessionProvider", () => ({
  useSession: jest.fn(),
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("useFetchCards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    (useSession as jest.Mock).mockReturnValue({ userId: "user1" });

    const { result } = renderHook(() => useFetchCards());

    expect(result.current.unknownCards).toBe(0);
    expect(result.current.knownCards).toBe(0);
    expect(result.current.learningCards).toBe(0);
    expect(result.current.isLearningModalVisible).toBe(false);
    expect(result.current.currentCard).toBe(0);
    expect(result.current.currentDeckCardsCount).toBe(0);
    expect(result.current.dueCards).toBe(0);
    expect(result.current.cards).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.refreshing).toBe(false);
  });

  it("should fetch SRS data successfully and update the state", async () => {
    const mockSrsData = [
      {
        mind_id: 1,
        state: State.New,
        due: "2023-01-01T00:00:00Z",
        minds: {
          id: 1,
          text: "Mind 1",
          summaries: { title: "Summary 1", authors: { name: "Author 1" } },
        },
      },
      {
        mind_id: 2,
        state: State.Review,
        due: "2023-01-01T00:00:00Z",
        minds: {
          id: 2,
          text: "Mind 2",
          summaries: { title: "Summary 2", authors: { name: "Author 2" } },
        },
      },
    ];
    const mockSavedMinds = [
      { id: 1, text: "Mind 1", summaries: { title: "Summary 1", authors: { name: "Author 1" } } },
      { id: 2, text: "Mind 2", summaries: { title: "Summary 2", authors: { name: "Author 2" } } },
    ];

    (useSession as jest.Mock).mockReturnValue({ userId: "user1" });
    (getUserSrsData as jest.Mock).mockResolvedValue(mockSrsData);
    (getUserSavedMinds as jest.Mock).mockResolvedValue(mockSavedMinds);

    const { result } = renderHook(() => useFetchCards());

    await waitFor(() => {
      expect(result.current.unknownCards).toBe(1);
    });
    expect(result.current.knownCards).toBe(1);
    expect(result.current.learningCards).toBe(0);
    expect(result.current.dueCards).toBe(2);
    expect(result.current.cards.length).toBe(2);
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors during fetch", async () => {
    const mockError = new Error("mock-error");

    (useSession as jest.Mock).mockReturnValue({ userId: "user1" });
    (getUserSrsData as jest.Mock).mockRejectedValue(mockError);
    (getUserSavedMinds as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFetchCards());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(Alert.alert).toHaveBeenCalledWith("Erreur", "Impossible de récupérer les données SRS.");
  });

  it("should handle refresh action correctly", async () => {
    const mockSrsData = [
      {
        mind_id: 1,
        state: State.New,
        due: "2023-01-01T00:00:00Z",
        minds: {
          id: 1,
          text: "Mind 1",
          summaries: { title: "Summary 1", authors: { name: "Author 1" } },
        },
      },
      {
        mind_id: 2,
        state: State.Review,
        due: "2023-01-01T00:00:00Z",
        minds: {
          id: 2,
          text: "Mind 2",
          summaries: { title: "Summary 2", authors: { name: "Author 2" } },
        },
      },
    ];
    const mockSavedMinds = [
      { id: 1, text: "Mind 1", summaries: { title: "Summary 1", authors: { name: "Author 1" } } },
      { id: 2, text: "Mind 2", summaries: { title: "Summary 2", authors: { name: "Author 2" } } },
    ];

    (useSession as jest.Mock).mockReturnValue({ userId: "user1" });
    (getUserSrsData as jest.Mock).mockResolvedValue(mockSrsData);
    (getUserSavedMinds as jest.Mock).mockResolvedValue(mockSavedMinds);

    const { result } = renderHook(() => useFetchCards());

    await waitFor(() => {
      expect(result.current.unknownCards).toBe(1);
    });

    result.current.onRefresh();

    expect(result.current.refreshing).toBe(true);

    await waitFor(() => {
      expect(result.current.refreshing).toBe(false);
    });
    expect(result.current.unknownCards).toBe(1);
    expect(result.current.knownCards).toBe(1);
    expect(result.current.learningCards).toBe(0);
    expect(result.current.dueCards).toBe(2);
    expect(result.current.cards.length).toBe(2);
  });

  it("should handle learning action correctly", async () => {
    (useSession as jest.Mock).mockReturnValue({ userId: "user1" });

    const { result } = renderHook(() => useFetchCards());

    result.current.handleLearning(5);

    expect(result.current.isLearningModalVisible).toBe(true);

    expect(result.current.currentCard).toBe(1);
    await waitFor(() => {
      expect(result.current.currentDeckCardsCount).toBe(5);
    });
  });
});
