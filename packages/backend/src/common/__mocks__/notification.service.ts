export const mockNotificationService = {
  markNotificationAsRead: jest.fn(),
  markNotificationAsUnread: jest.fn(),
  deleteNotification: jest.fn(),
  storeNotification: jest.fn(),
  sendNotification: jest.fn(),
  notifyFriendRequest: jest.fn(),
  notifyFriendRequestAccepted: jest.fn(),
  notifyFriendReadSummary: jest.fn(),
  notifyFriendSavedSummary: jest.fn(),
};
