import { handleShareProfile } from "@/utils/profile";
import { Share } from "react-native";

jest.mock("react-native", () => ({
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

describe("handleShareProfile", () => {
  const username = "testuser";
  const profileId = "12345";
  const expectedUrl = `mindify://profile/${profileId}`;

  it("should share the correct profile information", async () => {
    (Share.share as jest.Mock).mockResolvedValueOnce(undefined);

    await handleShareProfile(username, profileId);

    expect(Share.share).toHaveBeenCalledWith({
      title: username,
      message: `Découvre le profil de ${username} sur l'application !`,
      url: expectedUrl,
    });
  });

  it("shoud handle error when sharing profile", async () => {
    const error = new Error("Failed to share profile");
    (Share.share as jest.Mock).mockRejectedValueOnce(error);

    await handleShareProfile(username, profileId);

    expect(console.error).toHaveBeenCalledWith(error);
  });
});
