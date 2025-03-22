import {
  askForFriend,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriendsIds,
  getPendingFriendsIds,
  getFriendStatus,
} from "@/actions/friends.action";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("Friend Functions", () => {
  const mockUserId = "user1";
  const mockProfileId = "user2";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("askForFriend", () => {
    test("should send friend request successfully", async () => {
      (supabase.from("friends").insert as jest.Mock).mockResolvedValueOnce({ error: null });

      const data = await askForFriend(mockUserId, mockProfileId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").insert).toHaveBeenCalledWith({
        user_id: mockUserId,
        friend_id: mockProfileId,
      });
      expect(data).toEqual({ message: "Demande d'ami envoyée avec succès." });
    });

    test("should throw error when trying to add self as a friend", async () => {
      await expect(askForFriend(mockUserId, mockUserId)).rejects.toThrow(
        "Impossible de s'ajouter soi-même en ami.",
      );

      expect(supabase.from).not.toHaveBeenCalled();
    });

    test("should handle Supabase error when sending friend request", async () => {
      const mockError = new Error("Supabase insert error");
      (supabase.from("friends").insert as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(askForFriend(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible d'envoyer la demande d'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });

  describe("cancelFriendRequest", () => {
    test("should cancel friend request successfully", async () => {
      (supabase.from("friends").delete().match as jest.Mock).mockReturnValueOnce({ error: null });

      const data = await cancelFriendRequest(mockUserId, mockProfileId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").delete).toHaveBeenCalled();
      expect(supabase.from("friends").delete().match).toHaveBeenCalledWith({
        user_id: mockUserId,
        friend_id: mockProfileId,
      });
      expect(data).toEqual({ message: "Demande d'ami annulée avec succès." });
    });

    test("should handle error when cancelling friend request", async () => {
      (supabase.from("friends").delete().match as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to cancel friend request"),
      );

      await expect(cancelFriendRequest(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible d'annuler la demande d'ami.",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("acceptFriendRequest", () => {
    test("should accept friend request successfully", async () => {
      const data = await acceptFriendRequest(mockUserId, mockProfileId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").upsert).toHaveBeenCalledWith({
        user_id: mockUserId,
        friend_id: mockProfileId,
      });
      expect(data).toEqual({ message: "Demande d'ami acceptée avec succès." });
    });

    test("should handle error when accepting friend request", async () => {
      const error = new Error("Failed to accept friend request");
      (supabase.from("friends").upsert as jest.Mock).mockRejectedValueOnce(error);

      await expect(acceptFriendRequest(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible d'accepter la demande d'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("rejectFriendRequest", () => {
    test("it should reject a friend request successfully", async () => {
      (supabase.from("friends").delete().match as jest.Mock).mockReturnValueOnce({ error: null });

      const data = await rejectFriendRequest(mockUserId, mockProfileId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").delete).toHaveBeenCalled();
      expect(supabase.from("friends").delete().match).toHaveBeenCalledWith({
        user_id: mockProfileId,
        friend_id: mockUserId,
      });
      expect(data).toEqual({ message: "Demande d'ami rejetée avec succès." });
    });

    test("should handle error when rejecting a friend request", async () => {
      const error = new Error("Failed to reject friend request");
      (supabase.from("friends").delete().match as jest.Mock).mockRejectedValueOnce(error);

      await expect(rejectFriendRequest(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible de rejeter la demande d'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });

    test("should handle error from the first delete operation", async () => {
      const errorFirstDelete = new Error("First delete error");
      (supabase.from("friends").delete().match as jest.Mock)
        .mockResolvedValueOnce({ error: errorFirstDelete })
        .mockResolvedValueOnce({ error: null });

      await expect(rejectFriendRequest(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible de rejeter la demande d'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(errorFirstDelete, null);
    });

    test("should handle error from the second delete operation", async () => {
      const errorSecondDelete = new Error("Second delete error");
      (supabase.from("friends").delete().match as jest.Mock)
        .mockResolvedValueOnce({ error: null })
        .mockResolvedValueOnce({ error: errorSecondDelete });

      await expect(rejectFriendRequest(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible de rejeter la demande d'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(null, errorSecondDelete);
    });

    test("should handle errors from both delete operations", async () => {
      const errorFirstDelete = new Error("First delete error");
      const errorSecondDelete = new Error("Second delete error");
      (supabase.from("friends").delete().match as jest.Mock)
        .mockResolvedValueOnce({ error: errorFirstDelete })
        .mockResolvedValueOnce({ error: errorSecondDelete });

      await expect(rejectFriendRequest(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible de rejeter la demande d'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(errorFirstDelete, errorSecondDelete);
    });
  });

  describe("removeFriend", () => {
    test("it should remove a friend successfully", async () => {
      (supabase.from("friends").delete().match as jest.Mock).mockReturnValueOnce({ error: null });

      const data = await removeFriend(mockUserId, mockProfileId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").delete).toHaveBeenCalled();
      expect(supabase.from("friends").delete().match).toHaveBeenCalledWith({
        user_id: mockUserId,
        friend_id: mockProfileId,
      });
      expect(data).toEqual({ message: "Ami supprimé avec succès." });
    });

    test("it should handle error when removing a friend", async () => {
      const error = new Error("Failed to remove friend");
      (supabase.from("friends").delete().match as jest.Mock).mockRejectedValueOnce(error);

      await expect(removeFriend(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible de supprimer l'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });

    test("it should handle error when removing a friend from the second delete operation", async () => {
      const error = new Error("Failed to remove friend");
      (supabase.from("friends").delete().match as jest.Mock)
        .mockResolvedValueOnce({ error: null })
        .mockRejectedValueOnce(error);

      await expect(removeFriend(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible de supprimer l'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });

    test("it should handle error when removing a friend from the first delete operation", async () => {
      const error = new Error("Failed to remove friend");
      (supabase.from("friends").delete().match as jest.Mock)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ error: null });

      await expect(removeFriend(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible de supprimer l'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });

    test("it should handle errors from both delete operations", async () => {
      const errorFirstDelete = new Error("First delete error");
      const errorSecondDelete = new Error("Second delete error");
      (supabase.from("friends").delete().match as jest.Mock)
        .mockResolvedValueOnce({ error: errorFirstDelete })
        .mockResolvedValueOnce({ error: errorSecondDelete });

      await expect(removeFriend(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible de supprimer l'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(errorFirstDelete);
    });
  });

  describe("getFriendsIds", () => {
    it("should get a list of friends IDs separating them by their status", async () => {
      const mockUserId = "user1";
      const userFriends = [{ friend_id: "user2" }, { friend_id: "user3" }];
      const usersWhoAskedToBeFriendWithCurrentUser = [{ user_id: "user3" }];

      (supabase.from("friends").select("friend_id").eq as jest.Mock)
        .mockResolvedValueOnce({ data: userFriends, error: null })
        .mockResolvedValueOnce({ data: usersWhoAskedToBeFriendWithCurrentUser, error: null });

      const data = await getFriendsIds(mockUserId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").select).toHaveBeenCalledWith("friend_id");
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockUserId,
      );
      expect(supabase.from("friends").select("user_id").eq).toHaveBeenCalledWith(
        "friend_id",
        mockUserId,
      );
      expect(data).toEqual({
        friendsIds: ["user3"],
        askedFriendsIds: ["user2"], // user2 asked to be friend with user1 and user3 is already in the friendsIds
        requestedFriendsIds: [], // it is empty since user3 is already in the friendsIds
      });
    });

    it("should return an empty array when there are no friends", async () => {
      const mockUserId = "user1";
      const userFriends: [] = [];
      const usersWhoAskedToBeFriendWithCurrentUser: [] = [];

      (supabase.from("friends").select("friend_id").eq as jest.Mock)
        .mockResolvedValueOnce({ data: userFriends, error: null })
        .mockResolvedValueOnce({ data: usersWhoAskedToBeFriendWithCurrentUser, error: null });

      const data = await getFriendsIds(mockUserId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").select).toHaveBeenCalledWith("friend_id");
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockUserId,
      );
      expect(supabase.from("friends").select("user_id").eq).toHaveBeenCalledWith(
        "friend_id",
        mockUserId,
      );
      expect(data).toEqual({ friendsIds: [], askedFriendsIds: [], requestedFriendsIds: [] });
    });

    it("should return return an empty friendsIds array but filled askedFriendsIds array when no friends but a request from the current user", async () => {
      const mockUserId = "user1";
      const userFriends = [{ friend_id: "user2" }];
      const usersWhoAskedToBeFriendWithCurrentUser: [] = [];

      (supabase.from("friends").select("friend_id").eq as jest.Mock)
        .mockResolvedValueOnce({ data: userFriends, error: null })
        .mockResolvedValueOnce({ data: usersWhoAskedToBeFriendWithCurrentUser, error: null });

      const data = await getFriendsIds(mockUserId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").select).toHaveBeenCalledWith("friend_id");
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockUserId,
      );
      expect(supabase.from("friends").select("user_id").eq).toHaveBeenCalledWith(
        "friend_id",
        mockUserId,
      );
      expect(data).toEqual({
        friendsIds: [],
        askedFriendsIds: ["user2"],
        requestedFriendsIds: [],
      });
    });

    it("should return return an empty friendsIds array but filled requestedFriendsIds array when no friends but a request to the current user", async () => {
      const mockUserId = "user1";
      const mockUserToFriendData: [] = [];
      const mockFriendToUserData = [{ user_id: "user2" }];

      (supabase.from("friends").select("friend_id").eq as jest.Mock)
        .mockResolvedValueOnce({ data: mockUserToFriendData, error: null })
        .mockResolvedValueOnce({ data: mockFriendToUserData, error: null });

      const data = await getFriendsIds(mockUserId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").select).toHaveBeenCalledWith("friend_id");
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockUserId,
      );
      expect(supabase.from("friends").select("user_id").eq).toHaveBeenCalledWith(
        "friend_id",
        mockUserId,
      );
      expect(data).toEqual({
        friendsIds: [],
        askedFriendsIds: [],
        requestedFriendsIds: ["user2"],
      });
    });

    it("should handle error when getting friends IDs", async () => {
      const mockUserId = "user1";
      const error = new Error("Failed to get friends IDs");

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockRejectedValueOnce(error);

      await expect(getFriendsIds(mockUserId)).rejects.toThrow("Impossible de récupérer les amis.");

      expect(console.error).toHaveBeenCalledWith(error);
    });

    it("should handle error when getting friends' requests IDs", async () => {
      const mockUserId = "user1";
      const error = new Error("Failed to get friends requests IDs");

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockResolvedValueOnce({
        data: [],
        error: null,
      });
      (supabase.from("friends").select("user_id").eq as jest.Mock).mockRejectedValueOnce(error);

      await expect(getFriendsIds(mockUserId)).rejects.toThrow("Impossible de récupérer les amis.");

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getPendingFriendsIds", () => {
    it("should get a list of pending friends IDs", async () => {
      const mockUserId = "user1";
      const mockUserFriends = [{ friend_id: "friend1" }, { friend_id: "friend2" }];

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockUserFriends,
        error: null,
      });

      const data = await getPendingFriendsIds(mockUserId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").select).toHaveBeenCalledWith("friend_id");
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockUserId,
      );
      expect(data).toEqual(["friend1", "friend2"]);
    });

    it("should return an empty array when there are no pending friends", async () => {
      const mockUserId = "user1";
      const mockUserFriends: [] = [];

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockUserFriends,
        error: null,
      });

      const data = await getPendingFriendsIds(mockUserId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").select).toHaveBeenCalledWith("friend_id");
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockUserId,
      );
      expect(data).toEqual([]);
    });

    it("should handle error when getting pending friends IDs", async () => {
      const mockUserId = "user1";
      const error = new Error("Failed to get pending friends IDs");

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockRejectedValueOnce(error);

      await expect(getPendingFriendsIds(mockUserId)).rejects.toThrow(
        "Impossible de récupérer les amis en attente.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });

    it("should handle error when getting users who asked the current user's friendship", async () => {
      const mockUserId = "user1";
      const error = new Error("Failed to get pending friends IDs");

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockResolvedValueOnce({
        data: [],
        error: null,
      });
      (supabase.from("friends").select("user_id").eq as jest.Mock).mockRejectedValueOnce(error);

      await expect(getPendingFriendsIds(mockUserId)).rejects.toThrow(
        "Impossible de récupérer les amis en attente.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getFriendStatus", () => {
    it("should get the pending status of a friend", async () => {
      const mockUserId = "user1";
      const mockProfileId = "user2";
      const mockUserFriends = [{ friend_id: "user2" }];
      const mockProfileFriends: [] = [];

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockUserFriends,
        error: null,
      });
      (supabase.from("friends").select("user_id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockProfileFriends,
        error: null,
      });

      const data = await getFriendStatus(mockUserId, mockProfileId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").select).toHaveBeenCalledWith("friend_id");
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockUserId,
      );
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockProfileId,
      );
      expect(data).toEqual("pending");
    });

    it("should get the requested status from a friend's perspective", async () => {
      const mockUserId = "user1";
      const mockProfileId = "user2";
      const mockUserFriends: [] = [];
      const mockProfileFriends = [{ friend_id: "user1" }];

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockUserFriends,
        error: null,
      });
      (supabase.from("friends").select("user_id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockProfileFriends,
        error: null,
      });

      const data = await getFriendStatus(mockUserId, mockProfileId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").select).toHaveBeenCalledWith("friend_id");
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockUserId,
      );
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockProfileId,
      );
      expect(data).toEqual("requested");
    });

    it("should get the accepted status when the user is the friend's friend", async () => {
      const mockUserId = "user1";
      const mockProfileId = "user2";
      const mockUserFriends = [{ friend_id: "user2" }];
      const mockProfileFriends = [{ friend_id: "user1" }];

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockUserFriends,
        error: null,
      });
      (supabase.from("friends").select("user_id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockProfileFriends,
        error: null,
      });

      const data = await getFriendStatus(mockUserId, mockProfileId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").select).toHaveBeenCalledWith("friend_id");
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockUserId,
      );
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockProfileId,
      );
      expect(data).toEqual("accepted");
    });

    it("should get the none status when the user is not the friend's friend", async () => {
      const mockUserId = "user1";
      const mockProfileId = "user2";
      const mockUserFriends = [{ friend_id: "user3" }];
      const mockProfileFriends = [{ friend_id: "user5" }];

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockUserFriends,
        error: null,
      });
      (supabase.from("friends").select("user_id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockProfileFriends,
        error: null,
      });

      const data = await getFriendStatus(mockUserId, mockProfileId);

      expect(supabase.from).toHaveBeenCalledWith("friends");
      expect(supabase.from("friends").select).toHaveBeenCalledWith("friend_id");
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockUserId,
      );
      expect(supabase.from("friends").select("friend_id").eq).toHaveBeenCalledWith(
        "user_id",
        mockProfileId,
      );
      expect(data).toEqual("none");
    });

    it("should handle error when getting the status of a friend", async () => {
      const mockUserId = "user1";
      const mockProfileId = "user2";
      const error = new Error("Failed to get friend status");

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockRejectedValueOnce(error);

      await expect(getFriendStatus(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible de récupérer le statut de l'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });

    it("should handle error when getting the friend's status from the friend's perspective", async () => {
      const mockUserId = "user1";
      const mockProfileId = "user2";
      const error = new Error("Failed to get friend status");

      (supabase.from("friends").select("friend_id").eq as jest.Mock).mockResolvedValueOnce({
        data: [],
        error: null,
      });
      (supabase.from("friends").select("user_id").eq as jest.Mock).mockRejectedValueOnce(error);

      await expect(getFriendStatus(mockUserId, mockProfileId)).rejects.toThrow(
        "Impossible de récupérer le statut de l'ami.",
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
});
