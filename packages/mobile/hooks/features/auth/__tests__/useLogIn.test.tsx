import { renderHook, act, waitFor } from "@testing-library/react-native";
import useLogIn from "@/hooks/features/auth/useLogIn";
import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

describe("useLogIn hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("initial state is set correctly", () => {
    const { result } = renderHook(() => useLogIn());
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.disabled).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  test("disabled is true if email or password is empty", async () => {
    const { result } = renderHook(() => useLogIn());

    result.current.setEmail("test@example.com");
    await waitFor(() => {
      expect(result.current.disabled).toBe(true);
    });

    result.current.setPassword("password123");
    await waitFor(() => {
      expect(result.current.disabled).toBe(false);
    });
  });

  test("handleSignIn sets loading to true and calls signInWithPassword", async () => {
    const { result } = renderHook(() => useLogIn());
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ error: null });

    act(() => {
      result.current.setEmail("test@example.com");
      result.current.setPassword("password123");
    });

    result.current.handleSignIn();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  test("shows alert on invalid sign-in attempt", async () => {
    const { result } = renderHook(() => useLogIn());
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: new Error("Invalid credentials"),
    });

    result.current.setEmail("invalid@example.com");
    result.current.setPassword("wrongpassword");

    await waitFor(() => {
      expect(result.current.disabled).toBe(false);
    });

    result.current.handleSignIn();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erreur",
        "Veuillez vérifier vos identifiants et réessayer. Si le problème persiste, veuillez contacter le support.",
      );
    });
  });

  test("shows alert if fields are empty on sign-in attempt", async () => {
    const { result } = renderHook(() => useLogIn());

    result.current.handleSignIn();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erreur",
        "Veuillez remplir tous les champs pour vous connecter.",
      );
    });
  });
});
