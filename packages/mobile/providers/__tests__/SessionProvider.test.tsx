import React from "react";
import { Alert } from "react-native";
import { renderHook, waitFor } from "@testing-library/react-native";
import { supabase } from "@/lib/supabase";
import { usePostHog } from "posthog-react-native";
import SessionProvider, { useSession } from "@/providers/SessionProvider";
import type { Session, UserMetadata } from "@supabase/supabase-js";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}));

jest.mock("posthog-react-native", () => ({
  usePostHog: jest.fn(),
}));

jest.mock("expo-tracking-transparency", () => ({
  getTrackingPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
}));

describe("SessionProvider", () => {
  let mockSession: Session;
  let mockUserMetadata: UserMetadata;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockSession = {
      user: {
        id: "test-user-id",
        user_metadata: {
          email: "test@example.com",
          name: "Test User",
        },
        app_metadata: {},
        aud: "",
        confirmed_at: "",
        created_at: "",
      },
      access_token: "",
      refresh_token: "",
      expires_in: 0,
      token_type: "",
    } as Session;

    mockUserMetadata = mockSession.user.user_metadata;

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
    });
    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) =>
      callback("SIGNED_IN", mockSession),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("initializes with correct session and user data", async () => {
    const posthog = { identify: jest.fn(), optIn: jest.fn(), optOut: jest.fn() };
    (usePostHog as jest.Mock).mockReturnValue(posthog);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    );

    const { result } = renderHook(() => useSession(), { wrapper });

    expect(result.current.session).toEqual(mockSession);
    expect(result.current.userId).toBe("test-user-id");
    expect(result.current.userMetadata).toEqual(mockUserMetadata);
  });

  it("calls posthog identify with userId and user metadata", async () => {
    const posthog = { identify: jest.fn(), optIn: jest.fn(), optOut: jest.fn() };
    (usePostHog as jest.Mock).mockReturnValue(posthog);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    );

    renderHook(() => useSession(), { wrapper });

    expect(posthog.identify).toHaveBeenCalledWith("test-user-id", {
      email: "test@example.com",
      name: "Test User",
    });
  });

  it("calls supabase.auth.signOut and resets posthog on handleLogout", async () => {
    const signOut = jest.fn().mockResolvedValue({});
    const posthog = { reset: jest.fn(), identify: jest.fn(), optIn: jest.fn(), optOut: jest.fn() };
    (supabase.auth.signOut as jest.Mock).mockImplementation(signOut);
    (usePostHog as jest.Mock).mockReturnValue(posthog);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    );

    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.handleLogout();

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
    });
    expect(posthog.reset).toHaveBeenCalledTimes(1);
  });

  it("displays alert if logout fails", async () => {
    const signOut = jest.fn().mockRejectedValue(new Error("Logout error"));
    const posthog = { reset: jest.fn(), identify: jest.fn(), optIn: jest.fn(), optOut: jest.fn() };
    (usePostHog as jest.Mock).mockReturnValue(posthog);
    (supabase.auth.signOut as jest.Mock).mockImplementation(signOut);
    const alertSpy = jest.spyOn(Alert, "alert");

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    );

    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.handleLogout();

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
    });
    expect(alertSpy).toHaveBeenCalledWith("Erreur lors de la déconnexion");
  });

  it("should handle adding name", async () => {
    const posthog = { reset: jest.fn(), identify: jest.fn(), optIn: jest.fn(), optOut: jest.fn() };
    (usePostHog as jest.Mock).mockReturnValue(posthog);
    (supabase.auth.updateUser as jest.Mock).mockResolvedValue({});

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    );

    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.handleAddName("Test User");

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      data: {
        name: "Test User",
        first_name: "Test",
        last_name: "User",
        full_name: "Test User",
      },
    });
  });

  it("should handle error when adding name fails", async () => {
    const mockError = new Error("Update user error");

    const posthog = { reset: jest.fn(), identify: jest.fn(), optIn: jest.fn(), optOut: jest.fn() };
    (usePostHog as jest.Mock).mockReturnValue(posthog);
    (supabase.auth.updateUser as jest.Mock).mockRejectedValue(mockError);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    );

    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.handleAddName("Test User");

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });
});
