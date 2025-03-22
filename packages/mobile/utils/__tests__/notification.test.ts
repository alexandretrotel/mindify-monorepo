import { getActionSheetOptions, categorizeNotifications } from "@/utils/notifications";
import { NotificationActionType, NotificationType } from "@/types/notifications";
import { Tables } from "@/types/supabase";

const mockNotification = (type: NotificationType, createdAt: string) =>
  ({
    id: 1,
    type,
    created_at: createdAt,
    friend_id: null,
    is_read: false,
    message: "Test message",
    mind_id: null,
    summary_id: null,
    title: "Test title",
    updated_at: null,
    user_id: "user_123",
    summaries: {
      author_id: 1,
      chapters_id: null,
      created_at: createdAt,
      id: 1,
      image_url: null,
      mindify_ai: null,
      reading_time: null,
      slug: "test-slug",
      source_type: "article",
      source_url: null,
      title: "Test Summary Title",
      topic_id: 1,
    },
  }) as Tables<"notifications"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
    };
  };

describe("getActionSheetOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return the correct options for friend notifications", () => {
    const notification = mockNotification(NotificationType.FriendRequest, new Date().toISOString());
    const options = getActionSheetOptions(notification);

    expect(options).toEqual([
      { label: "Voir le profil", type: NotificationActionType.ViewProfile },
      { label: "Accepter la demande", type: NotificationActionType.Accept },
      { label: "Refuser la demande", type: NotificationActionType.Reject },
      { label: "Supprimer", type: NotificationActionType.Delete },
      { label: "Annuler", type: NotificationActionType.Cancel },
    ]);
  });

  it("should return the correct options for flashcards due notifications", () => {
    const notification = mockNotification(NotificationType.FlashcardsDue, new Date().toISOString());
    const options = getActionSheetOptions(notification);

    expect(options).toEqual([
      {
        label: "Voir les flashcards",
        type: NotificationActionType.ViewFlashcards,
      },
      { label: "Supprimer", type: NotificationActionType.Delete },
      { label: "Annuler", type: NotificationActionType.Cancel },
    ]);
  });
});

describe("categorizeNotifications", () => {
  it("should categorize today's notifications correctly", () => {
    const now = new Date().toISOString();
    const notifications = [
      mockNotification(NotificationType.FlashcardsDue, now),
      mockNotification(NotificationType.Summary, now),
      mockNotification(NotificationType.FriendRequest, now),
    ];

    const result = categorizeNotifications(notifications);

    expect(result).toEqual([{ title: "Aujourd'hui", data: notifications }]);
  });

  it("should categorize this week's notifications correctly", () => {
    const now = new Date().toISOString();
    const yesterday = new Date(Date.now() - 86400000).toISOString(); // 1 day ago
    const notifications = [
      mockNotification(NotificationType.FlashcardsDue, now),
      mockNotification(NotificationType.Summary, yesterday),
      mockNotification(NotificationType.FriendRequest, yesterday),
    ];

    const result = categorizeNotifications(notifications);

    expect(result).toEqual([
      { title: "Aujourd'hui", data: [notifications[0]] },
      { title: "Cette semaine", data: notifications.slice(1) },
    ]);
  });

  it("should categorize this month's notifications correctly", () => {
    const now = new Date().toISOString();
    const yesterday = new Date(Date.now() - 86400000).toISOString(); // 1 day ago
    const lastWeek = new Date(Date.now() - 604800000).toISOString(); // 1 week ago
    const notifications = [
      mockNotification(NotificationType.FlashcardsDue, now),
      mockNotification(NotificationType.Summary, yesterday),
      mockNotification(NotificationType.FriendRequest, lastWeek),
    ];

    const result = categorizeNotifications(notifications);

    expect(result).toEqual([
      { title: "Aujourd'hui", data: [notifications[0]] },
      { title: "Cette semaine", data: [notifications[1], notifications[2]] },
    ]);
  });

  it("should categorize older notifications correctly", () => {
    const now = new Date().toISOString();
    const yesterday = new Date(Date.now() - 86400000).toISOString(); // 1 day ago
    const lastWeek = new Date(Date.now() - 604800000).toISOString(); // 1 week ago
    const lastMonth = new Date(Date.now() - 2592000000).toISOString(); // 1 month
    const notifications = [
      mockNotification(NotificationType.FlashcardsDue, now),
      mockNotification(NotificationType.Summary, yesterday),
      mockNotification(NotificationType.Summary, lastWeek),
      mockNotification(NotificationType.FriendRequest, lastMonth),
    ];

    const result = categorizeNotifications(notifications);

    expect(result).toEqual([
      { title: "Aujourd'hui", data: [notifications[0]] },
      { title: "Cette semaine", data: [notifications[1], notifications[2]] },
      { title: "Ce mois", data: [notifications[3]] },
    ]);
  });

  it("should handle an empty list of notifications", () => {
    const result = categorizeNotifications([]);
    expect(result).toEqual([]);
  });

  it("should handle notifications with the same date", () => {
    const now = new Date().toISOString();
    const notifications = [
      mockNotification(NotificationType.FlashcardsDue, now),
      mockNotification(NotificationType.Summary, now),
      mockNotification(NotificationType.FriendRequest, now),
    ];

    const result = categorizeNotifications(notifications);

    expect(result).toEqual([{ title: "Aujourd'hui", data: notifications }]);
  });
});
