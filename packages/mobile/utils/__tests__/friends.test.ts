import { getFriendButtonVariant, getFriendStatusText } from "@/utils/friends";
import type { FriendStatus } from "@/types/friends";

describe("Friend Utility Functions", () => {
  describe("getFriendButtonVariant", () => {
    it('should return default variants for "none" status', () => {
      const result = getFriendButtonVariant("none" as FriendStatus);
      expect(result).toEqual({
        variant: "default",
        textVariant: "textDefault",
      });
    });

    it('should return destructive variants for "pending" status', () => {
      const result = getFriendButtonVariant("pending" as FriendStatus);
      expect(result).toEqual({
        variant: "destructive",
        textVariant: "textDestructive",
      });
    });

    it('should return default variants for "requested" status', () => {
      const result = getFriendButtonVariant("requested" as FriendStatus);
      expect(result).toEqual({
        variant: "default",
        textVariant: "textDefault",
      });
    });

    it('should return destructive variants for "accepted" status', () => {
      const result = getFriendButtonVariant("accepted" as FriendStatus);
      expect(result).toEqual({
        variant: "destructive",
        textVariant: "textDestructive",
      });
    });

    it("should return default variants for unknown status", () => {
      const result = getFriendButtonVariant("unknown" as FriendStatus);
      expect(result).toEqual({
        variant: "default",
        textVariant: "textDefault",
      });
    });
  });

  describe("getFriendStatusText", () => {
    it('should return the correct text for "none" status', () => {
      const result = getFriendStatusText("none" as FriendStatus);
      expect(result).toBe("Ajouter en ami");
    });

    it('should return the correct text for "pending" status', () => {
      const result = getFriendStatusText("pending" as FriendStatus);
      expect(result).toBe("Annuler la demande");
    });

    it('should return the correct text for "requested" status', () => {
      const result = getFriendStatusText("requested" as FriendStatus);
      expect(result).toBe("Accepter la demande");
    });

    it('should return the correct text for "accepted" status', () => {
      const result = getFriendStatusText("accepted" as FriendStatus);
      expect(result).toBe("Supprimer l'ami");
    });

    it("should return default text for unknown status", () => {
      const result = getFriendStatusText("unknown" as FriendStatus);
      expect(result).toBe("Ajouter en ami");
    });
  });
});
