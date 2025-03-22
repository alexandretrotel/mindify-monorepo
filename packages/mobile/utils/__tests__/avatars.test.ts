import { getAvatar } from "@/utils/avatars";
import type { UserMetadata } from "@supabase/supabase-js";

describe("getAvatar", () => {
  it("should return custom_avatar if it exists", () => {
    const profile: UserMetadata = {
      custom_avatar: "http://example.com/custom-avatar.png",
      picture: null,
      avatar_url: null,
    };
    expect(getAvatar(profile)).toBe("http://example.com/custom-avatar.png");
  });

  it("should return picture if custom_avatar does not exist", () => {
    const profile: UserMetadata = {
      custom_avatar: null,
      picture: "http://example.com/picture.png",
      avatar_url: null,
    };
    expect(getAvatar(profile)).toBe("http://example.com/picture.png");
  });

  it("should return avatar_url if both custom_avatar and picture do not exist", () => {
    const profile: UserMetadata = {
      custom_avatar: null,
      picture: null,
      avatar_url: "http://example.com/avatar-url.png",
    };
    expect(getAvatar(profile)).toBe("http://example.com/avatar-url.png");
  });

  it("should return null if all avatar properties are null", () => {
    const profile: UserMetadata = {
      custom_avatar: null,
      picture: null,
      avatar_url: null,
    };
    expect(getAvatar(profile)).toBe(null);
  });
});
