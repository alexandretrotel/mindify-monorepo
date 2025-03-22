import { renderHook, act } from "@testing-library/react-native";
import useLearningModal from "@/hooks/features/learn/useLearningModal";
import { updateSrsData } from "@/actions/srs.action";
import { Alert } from "react-native";
import { Rating } from "ts-fsrs";
import { Tables } from "@/types/supabase";
import { SharedValue } from "react-native-reanimated";

jest.mock("@/actions/srs.action", () => ({
  postUserLearningSession: jest.fn(),
  updateSrsData: jest.fn(),
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("useLearningModal", () => {
  const mockFetchSrsData = jest.fn();
  const mockSetCurrentCard = jest.fn();
  const mockSetIsLearningModalVisible = jest.fn();
  const mockIsFlipped: SharedValue<boolean> = {
    value: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    modify: jest.fn(),
  };

  const mockCards = [
    {
      id: 1,
      created_at: "2023-01-01T00:00:00Z",
      mindify_ai: null,
      question: null,
      summary_id: null,
      text: "Card 1",
      summaries: {
        author_id: 1,
        chapters_id: null,
        created_at: "2023-01-01T00:00:00Z",
        id: 1,
        image_url: null,
        mindify_ai: null,
        reading_time: null,
        slug: "summary-1",
        source_type: "article",
        source_url: null,
        title: "Summary 1",
        topic_id: 1,
        authors: {
          name: "Author 1",
        },
      },
    },
    {
      id: 2,
      created_at: "2023-01-01T00:00:00Z",
      mindify_ai: null,
      question: null,
      summary_id: null,
      text: "Card 2",
      summaries: {
        author_id: 2,
        chapters_id: null,
        created_at: "2023-01-01T00:00:00Z",
        id: 2,
        image_url: null,
        mindify_ai: null,
        reading_time: null,
        slug: "summary-2",
        source_type: "article",
        source_url: null,
        title: "Summary 2",
        topic_id: 2,
        authors: {
          name: "Author 2",
        },
      },
    },
  ] as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
    };
  })[];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() =>
      useLearningModal(
        mockFetchSrsData,
        mockCards.length,
        0,
        mockSetCurrentCard,
        mockSetIsLearningModalVisible,
        mockCards,
        mockIsFlipped,
      ),
    );

    const now = Date.now();
    const tolerance = 1000;

    expect(result.current.startTime).toBeGreaterThanOrEqual(now - tolerance);
    expect(result.current.startTime).toBeLessThanOrEqual(now + tolerance);

    expect(result.current.finished).toBe(false);
    expect(result.current.endTime).toBeNull();
    expect(result.current.totalTime).toBe("");
  });

  it("should handle next card correctly", () => {
    const { result } = renderHook(() =>
      useLearningModal(
        mockFetchSrsData,
        mockCards.length,
        0,
        mockSetCurrentCard,
        mockSetIsLearningModalVisible,
        mockCards,
        mockIsFlipped,
      ),
    );

    act(() => {
      result.current.handleNext();
    });

    expect(mockSetCurrentCard).toHaveBeenCalledWith(1);
    expect(mockIsFlipped.value).toBe(false);
  });

  it("should handle close correctly", () => {
    const { result } = renderHook(() =>
      useLearningModal(
        mockFetchSrsData,
        mockCards.length,
        0,
        mockSetCurrentCard,
        mockSetIsLearningModalVisible,
        mockCards,
        mockIsFlipped,
      ),
    );

    act(() => {
      result.current.handleClose();
    });

    expect(mockSetIsLearningModalVisible).toHaveBeenCalledWith(false);
    expect(mockSetCurrentCard).toHaveBeenCalledWith(0);
    expect(mockFetchSrsData).toHaveBeenCalled();

    expect(result.current.finished).toBe(false);
    expect(result.current.endTime).toBeNull();
    expect(result.current.currentCard).toBe(0);
  });

  it("should handle update card SRS data correctly", async () => {
    const { result } = renderHook(() =>
      useLearningModal(
        mockFetchSrsData,
        mockCards.length,
        1,
        mockSetCurrentCard,
        mockSetIsLearningModalVisible,
        mockCards,
        mockIsFlipped,
      ),
    );

    await act(async () => {
      await result.current.handleUpdateCardSrsData("user1", Rating.Good);
    });

    expect(updateSrsData).toHaveBeenCalledWith(1, "user1", Rating.Good);
    expect(mockSetCurrentCard).toHaveBeenCalledWith(2);
  });

  it("should handle errors during update card SRS data", async () => {
    const mockError = new Error("mock-error");
    (updateSrsData as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useLearningModal(
        mockFetchSrsData,
        mockCards.length,
        1,
        mockSetCurrentCard,
        mockSetIsLearningModalVisible,
        mockCards,
        mockIsFlipped,
      ),
    );

    await act(async () => {
      await result.current.handleUpdateCardSrsData("user1", Rating.Good);
    });

    expect(updateSrsData).toHaveBeenCalledWith(1, "user1", Rating.Good);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Erreur",
      "Une erreur est survenue lors de la mise à jour des données SRS",
    );
    expect(mockSetCurrentCard).toHaveBeenCalledWith(0);
  });
});
