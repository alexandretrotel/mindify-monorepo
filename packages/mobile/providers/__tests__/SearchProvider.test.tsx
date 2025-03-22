import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import SearchProvider, { useSearch } from "@/providers/SearchProvider";

describe("SearchProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("initializes with an empty search query", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SearchProvider>{children}</SearchProvider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.searchQuery).toBe("");
  });

  it("updates the search query", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SearchProvider>{children}</SearchProvider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSearchQuery("new query");
    });

    expect(result.current.searchQuery).toBe("new query");
  });

  it("returns correct context when used within SearchProvider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SearchProvider>{children}</SearchProvider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current).toHaveProperty("searchQuery");
    expect(result.current).toHaveProperty("setSearchQuery");
  });
});
