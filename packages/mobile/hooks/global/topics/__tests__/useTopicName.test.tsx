import { renderHook, waitFor } from "@testing-library/react-native";
import useTopicName from "@/hooks/global/topics/useTopicName";
import { getTopicName } from "@/actions/topics.action";

jest.mock("@/actions/topics.action", () => ({
  getTopicName: jest.fn(),
}));

describe("useTopicName", () => {
  const mockTopicId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useTopicName(mockTopicId));

    expect(result.current.topicName).toBe("Thème");
  });

  it("should fetch topic name successfully", async () => {
    const mockTopicName = "Science";

    (getTopicName as jest.Mock).mockResolvedValue(mockTopicName);

    const { result } = renderHook(() => useTopicName(mockTopicId));

    await waitFor(() => {
      expect(result.current.topicName).toBe(mockTopicName);
    });
  });

  it("should handle errors during fetch topic name", async () => {
    const mockError = new Error("Failed to fetch topic name");

    (getTopicName as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useTopicName(mockTopicId));

    await waitFor(() => {
      expect(result.current.topicName).toBe("Thème");
    });

    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
