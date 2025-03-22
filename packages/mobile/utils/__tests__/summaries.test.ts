import {
  handleSaveSummary,
  handleSeeOriginal,
  handleShareSummary,
  handleMarkSummaryAsRead,
  handleMarkSummaryAsUnread,
} from "@/utils/summaries";
import { Alert, Share } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  markSummaryAsRead,
  markSummaryAsUnread,
  saveSummary,
  unsaveSummary,
} from "@/actions/users.action";
import type { Tables } from "@/types/supabase";

jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
  Share: {
    share: jest.fn(),
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

jest.mock("@react-native-async-storage/async-storage", () => {
  return {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

jest.mock("expo-web-browser", () => ({
  openBrowserAsync: jest.fn(),
}));

jest.mock("@/actions/users.action", () => ({
  markSummaryAsRead: jest.fn(),
  markSummaryAsUnread: jest.fn(),
  saveSummary: jest.fn(),
  unsaveSummary: jest.fn(),
}));

describe("Summary Actions", () => {
  const userId = "user-123";
  const summary: Tables<"summaries"> & {
    authors: Tables<"authors">;
    topics: Tables<"topics">;
    chapters: Tables<"chapters">;
  } = {
    id: 1,
    title: "Test Summary",
    slug: "test-summary",
    production: true,
    authors: {
      created_at: "2023-01-01T00:00:00Z",
      description: null,
      id: 1,
      mindify_ai: false,
      name: "Author Name",
      slug: "author-name",
      production: true,
    },
    source_url: "https://example.com",
    topics: {
      black_icon: null,
      created_at: "",
      emoji: null,
      id: 1,
      name: "",
      slug: "",
      white_icon: null,
      production: true,
    },
    chapters: {
      created_at: "2023-01-01T00:00:00Z",
      id: 1,
      mindify_ai: null,
      texts: [],
      titles: [],
      production: true,
    },
    author_id: 123,
    chapters_id: null,
    created_at: "2023-01-01T00:00:00Z",
    image_url: null,
    mindify_ai: null,
    reading_time: null,
    source_type: "book",
    topic_id: 456,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should save summary when not saved", async () => {
    const setIsSavedSummary = jest.fn();
    const isSavedSummary = false;

    await handleSaveSummary(userId, summary, isSavedSummary, setIsSavedSummary);

    expect(setIsSavedSummary).toHaveBeenCalledWith(true);
    expect(saveSummary).toHaveBeenCalledWith(userId, summary.id);
  });

  it("should unsave summary when already saved", async () => {
    const setIsSavedSummary = jest.fn();
    const isSavedSummary = true;

    await handleSaveSummary(userId, summary, isSavedSummary, setIsSavedSummary);

    expect(setIsSavedSummary).toHaveBeenCalledWith(false);
    expect(unsaveSummary).toHaveBeenCalledWith(userId, summary.id);
  });

  it("should handle error when saving fails", async () => {
    const setIsSavedSummary = jest.fn();
    const isSavedSummary = false;
    (saveSummary as jest.Mock).mockRejectedValueOnce(new Error("Save failed"));

    await handleSaveSummary(userId, summary, isSavedSummary, setIsSavedSummary);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erreur",
      "Une erreur est survenue lors de la sauvegarde",
    );
    expect(setIsSavedSummary).toHaveBeenCalledWith(true); // Roll back to original state
  });

  it("should open original source URL", async () => {
    await handleSeeOriginal(summary);

    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(summary.source_url);
  });

  it("should handle error when opening original URL fails", async () => {
    (WebBrowser.openBrowserAsync as jest.Mock).mockRejectedValueOnce(new Error("Open failed"));

    await handleSeeOriginal(summary);

    expect(Alert.alert).toHaveBeenCalledWith("Erreur", "Impossible d'ouvrir le lien");
  });

  it("should share the summary", async () => {
    await handleShareSummary(summary);

    expect(Share.share).toHaveBeenCalledWith({
      title: summary.title,
      message: `Découvre le résumé ${summary.title} de ${summary.authors.name} sur Mindify.`,
      url: `mindify://summary/1`,
    });
  });

  it("should mark summary as read", async () => {
    const setIsRead = jest.fn();

    await handleMarkSummaryAsRead(userId, setIsRead, summary.id);

    expect(setIsRead).toHaveBeenCalledWith(true);
    expect(markSummaryAsRead).toHaveBeenCalledWith(userId, summary.id);
  });

  it("should handle error when marking as read fails", async () => {
    const setIsRead = jest.fn();
    (markSummaryAsRead as jest.Mock).mockRejectedValueOnce(new Error("Mark as read failed"));

    await handleMarkSummaryAsRead(userId, setIsRead, summary.id);

    expect(setIsRead).toHaveBeenCalledWith(false);
    expect(Alert.alert).toHaveBeenCalledWith("Erreur", "Impossible de marquer le résumé comme lu");
  });

  it("should mark summary as unread", async () => {
    const setIsRead = jest.fn();

    await handleMarkSummaryAsUnread(userId, setIsRead, summary.id);

    expect(setIsRead).toHaveBeenCalledWith(false);
    expect(markSummaryAsUnread).toHaveBeenCalledWith(userId, summary.id);
  });

  it("should handle error when marking as unread fails", async () => {
    const setIsRead = jest.fn();
    (markSummaryAsUnread as jest.Mock).mockRejectedValueOnce(new Error("Mark as unread failed"));

    await handleMarkSummaryAsUnread(userId, setIsRead, summary.id);

    expect(setIsRead).toHaveBeenCalledWith(true);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Erreur",
      "Impossible de marquer le résumé comme non lu",
    );
  });
});
