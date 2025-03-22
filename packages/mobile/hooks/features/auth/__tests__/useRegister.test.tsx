import { renderHook, waitFor } from "@testing-library/react-native";
import useLogIn from "@/hooks/features/auth/useRegister";
import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

describe("useRegister", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useLogIn());

    expect(result.current.name).toBe("");
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.disabled).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it("should enable the sign-up button when all fields are filled", async () => {
    const { result } = renderHook(() => useLogIn());

    result.current.setName("John Doe");
    result.current.setEmail("john.doe@example.com");
    result.current.setPassword("password123");
    result.current.setConfirmPassword("password123");

    await waitFor(() => {
      expect(result.current.disabled).toBe(false);
    });
  });

  it("should keep the sign-up button disabled if any field is empty", async () => {
    const { result } = renderHook(() => useLogIn());

    result.current.setName("John");
    result.current.setEmail("john.doe@example.com");
    result.current.setPassword("password123");

    await waitFor(() => {
      expect(result.current.disabled).toBe(true);
    });
  });

  it("should set loading state during sign-up and handle success", async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({ error: null });

    const { result } = renderHook(() => useLogIn());

    result.current.setEmail("john.doe@example.com");
    result.current.setPassword("password123");
    result.current.setName("John");
    result.current.setConfirmPassword("password123");

    await waitFor(() => {
      expect(result.current.disabled).toBe(false);
    });

    result.current.handleSignUp();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it("should handle sign-up failure and show alert", async () => {
    const mockError = new Error("Sign-up failed");
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({ error: mockError });

    const { result } = renderHook(() => useLogIn());

    result.current.setEmail("john.doe@example.com");
    result.current.setPassword("password123");
    result.current.setName("John");
    result.current.setConfirmPassword("password123");

    await waitFor(() => {
      expect(result.current.disabled).toBe(false);
    });

    result.current.handleSignUp();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      "Erreur",
      "Veuillez vérifier vos identifiants et réessayer. Si le problème persiste, veuillez contacter le support.",
    );
  });

  it("should show alert if required fields are missing", async () => {
    const { result } = renderHook(() => useLogIn());

    result.current.handleSignUp();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erreur",
        "Veuillez remplir tous les champs pour vous connecter.",
      );
    });
  });
});
