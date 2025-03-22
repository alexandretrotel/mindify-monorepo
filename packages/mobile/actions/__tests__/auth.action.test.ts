import { updatePassword, deleteUser } from "@/actions/auth.action";
import { supabase } from "@/lib/supabase";
import { updatePasswordFormSchema } from "@/schema/auth.schema";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      updateUser: jest.fn(),
    },
    rpc: jest.fn(),
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("Auth Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updatePassword", () => {
    const validPassword = "newPassword123";
    const invalidPassword = "123";

    it("should throw an error if passwords do not match", async () => {
      await expect(updatePassword(validPassword, "differentPassword")).rejects.toThrow(
        "Les mots de passe ne correspondent pas",
      );
    });

    it("should throw an error if new password is invalid", async () => {
      const mockParse = jest.spyOn(updatePasswordFormSchema, "parse").mockImplementation(() => {
        throw new Error("Validation error");
      });

      await expect(updatePassword(invalidPassword, invalidPassword)).rejects.toThrow(
        "Mot de passe invalide",
      );

      mockParse.mockRestore();
    });

    it("should update the password successfully", async () => {
      (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({ error: null });

      const data = await updatePassword(validPassword, validPassword);
      expect(data).toEqual({ message: "Mot de passe mis à jour avec succès" });
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: validPassword,
      });
    });

    it("should throw an error if updating password fails", async () => {
      (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({
        error: new Error("Update error"),
      });

      await expect(updatePassword(validPassword, validPassword)).rejects.toThrow(
        "Impossible de mettre à jour le mot de passe",
      );
    });
  });

  describe("deleteUser", () => {
    const userId = "user-id-123";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should delete the user successfully", async () => {
      (supabase.rpc as jest.Mock).mockResolvedValueOnce({ error: null });

      await expect(deleteUser(userId)).resolves.toEqual({
        message: "Compte supprimé avec succès.",
      });
      expect(supabase.rpc).toHaveBeenCalledWith("delete_user", {
        user_id: userId,
      });
    });

    it("should throw an error if deleting the user fails", async () => {
      (supabase.rpc as jest.Mock).mockResolvedValueOnce({
        error: new Error("Delete error"),
      });

      await expect(deleteUser(userId)).rejects.toThrow("Impossible de supprimer le compte.");
    });
  });
});
