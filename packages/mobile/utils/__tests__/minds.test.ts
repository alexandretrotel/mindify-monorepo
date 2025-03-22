import { onShare, handleSaveMind, handleLikeMind } from "@/utils/minds";
import { Alert, Share } from "react-native";
import { likeMind, saveMind, unlikeMind, unsaveMind } from "@/actions/minds.action";
import { Mind } from "@/types/minds";

jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
  Share: {
    share: jest.fn(),
  },
}));

jest.mock("@/actions/minds.action", () => ({
  likeMind: jest.fn(),
  saveMind: jest.fn(),
  unlikeMind: jest.fn(),
  unsaveMind: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("Mind Actions", () => {
  const mockSetSavedMind = jest.fn();
  const mockSetLikedMind = jest.fn();
  const mockSetSavedMindCount = jest.fn();
  const mockSetLikedMindCount = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("onShare", () => {
    it("should share a mind", async () => {
      const userName = "Test User";
      const mind: Mind = {
        id: 1,
        text: "The power of habit can shape your destiny.",
        summary_id: 101,
        created_at: new Date().toISOString(),
        mindify_ai: true,
        question: "How can you develop a productive habit?",
        production: true,
        summaries: {
          author_id: 1,
          chapters_id: null,
          created_at: new Date().toISOString(),
          id: 101,
          image_url: null,
          mindify_ai: null,
          reading_time: null,
          slug: "the-power-of-habit",
          source_type: "article",
          source_url: null,
          title: "The Power of Habit",
          topic_id: 1,
          production: true,
          authors: {
            created_at: "",
            description: null,
            id: 0,
            mindify_ai: false,
            name: "",
            slug: "",
            production: true,
          },
        },
      };

      await onShare(userName, mind);
      expect(Share.share).toHaveBeenCalledWith({
        title: `${userName} te partage un MIND !`,
        message: expect.stringContaining("The power of habit can shape your destiny."),
      });
    });

    it("should handle errors when sharing", async () => {
      (Share.share as jest.Mock).mockRejectedValueOnce(new Error("Share error"));
      await onShare("Test User", { text: "Test" } as Mind);
      expect(Alert.alert).toHaveBeenCalledWith(
        "Une erreur est survenue lors du partage de la citation",
      );
    });
  });

  describe("handleSaveMind", () => {
    it("should alert if user is not logged in", async () => {
      await handleSaveMind("", false, 1, mockSetSavedMind);
      expect(Alert.alert).toHaveBeenCalledWith("Tu dois être connecté pour sauvegarder un MIND");
    });

    it("should save mind when it is not saved", async () => {
      const userId = "user123";
      const mindId = 1;

      await handleSaveMind(userId, false, mindId, mockSetSavedMind, mockSetSavedMindCount);
      expect(mockSetSavedMind).toHaveBeenCalledWith(true);
      expect(saveMind).toHaveBeenCalledWith(mindId, userId);
    });

    it("should unsave mind when it is already saved", async () => {
      const userId = "user123";
      const mindId = 1;

      await handleSaveMind(userId, true, mindId, mockSetSavedMind, mockSetSavedMindCount);
      expect(mockSetSavedMind).toHaveBeenCalledWith(false);
      expect(unsaveMind).toHaveBeenCalledWith(mindId, userId);
    });

    it("should handle errors when saving mind", async () => {
      const userId = "user123";
      const mindId = 1;
      (saveMind as jest.Mock).mockRejectedValueOnce(new Error("Save error"));

      await handleSaveMind(userId, false, mindId, mockSetSavedMind);
      expect(mockSetSavedMind).toHaveBeenCalledWith(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        "Une erreur est survenue lors de la sauvegarde du MIND",
      );
    });

    it("should handle errors when unsaving mind", async () => {
      const userId = "user123";
      const mindId = 1;
      (unsaveMind as jest.Mock).mockRejectedValueOnce(new Error("Unsave error"));

      await handleSaveMind(userId, true, mindId, mockSetSavedMind);
      expect(mockSetSavedMind).toHaveBeenCalledWith(true);
      expect(Alert.alert).toHaveBeenCalledWith(
        "Une erreur est survenue lors de la suppression du MIND",
      );
    });
  });

  describe("handleLikeMind", () => {
    it("should alert if user is not logged in", async () => {
      await handleLikeMind("", false, 1, mockSetLikedMind);
      expect(Alert.alert).toHaveBeenCalledWith("Tu dois être connecté pour aimer un MIND");
    });

    it("should like mind when it is not liked", async () => {
      const userId = "user123";
      const mindId = 1;

      await handleLikeMind(userId, false, mindId, mockSetLikedMind, mockSetLikedMindCount);
      expect(mockSetLikedMind).toHaveBeenCalledWith(true);
      expect(likeMind).toHaveBeenCalledWith(mindId, userId);
    });

    it("should unlike mind when it is already liked", async () => {
      const userId = "user123";
      const mindId = 1;

      await handleLikeMind(userId, true, mindId, mockSetLikedMind, mockSetLikedMindCount);
      expect(mockSetLikedMind).toHaveBeenCalledWith(false);
      expect(unlikeMind).toHaveBeenCalledWith(mindId, userId);
    });

    it("should handle errors when liking mind", async () => {
      const userId = "user123";
      const mindId = 1;
      (likeMind as jest.Mock).mockRejectedValueOnce(new Error("Like error"));

      await handleLikeMind(userId, false, mindId, mockSetLikedMind);
      expect(mockSetLikedMind).toHaveBeenCalledWith(false);
      expect(Alert.alert).toHaveBeenCalledWith("Une erreur est survenue lors du like du MIND");
    });

    it("should handle errors when unliking mind", async () => {
      const userId = "user123";
      const mindId = 1;
      (unlikeMind as jest.Mock).mockRejectedValueOnce(new Error("Unlike error"));

      await handleLikeMind(userId, true, mindId, mockSetLikedMind);
      expect(mockSetLikedMind).toHaveBeenCalledWith(true);
      expect(Alert.alert).toHaveBeenCalledWith(
        "Une erreur est survenue lors de la suppression du like du MIND",
      );
    });
  });
});
