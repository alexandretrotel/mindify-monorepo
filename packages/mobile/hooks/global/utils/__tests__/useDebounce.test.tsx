import { renderHook, act } from "@testing-library/react-native";
import useDebounce from "@/hooks/global/utils/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "clearTimeout");
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));

    expect(result.current).toBe("initial");
  });

  it("should update the debounced value after the specified delay", async () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 500 },
    });

    rerender({ value: "updated", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("updated");
  });

  it("should clear the timeout on unmount", () => {
    const { unmount } = renderHook(() => useDebounce("initial", 500));

    unmount();

    expect(global.clearTimeout).toHaveBeenCalledTimes(1);
  });

  it("should clear the timeout when value or delay changes", () => {
    const { rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 500 },
    });

    rerender({ value: "updated", delay: 500 });

    expect(global.clearTimeout).toHaveBeenCalledTimes(1);

    rerender({ value: "updated again", delay: 500 });

    expect(global.clearTimeout).toHaveBeenCalledTimes(2);
  });
});
