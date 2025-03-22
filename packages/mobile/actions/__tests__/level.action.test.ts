import { supabase } from "@/lib/supabase";
import { getUserLevel } from "@/actions/level.action";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    rpc: jest.fn(),
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("Level Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserLevel", () => {
    const userId = "test-user-id";

    it("should return the user level data", async () => {
      const mockData = [
        {
          xp: 100,
          level: 1,
          xp_for_next_level: 200,
          xp_of_current_level: 0,
          progression: 50,
        },
      ];

      (supabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: mockData,
        error: null,
      });

      const userLevel = await getUserLevel(userId);

      expect(userLevel).toEqual({
        xp: 100,
        level: 1,
        xp_for_next_level: 200,
        xp_of_current_level: 0,
        progression: 50,
      });
    });

    it("should throw an error if there is an issue retrieving the user level", async () => {
      (supabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: new Error("RPC error"),
      });

      await expect(getUserLevel(userId)).rejects.toThrow("Impossible de récupérer le niveau.");
    });
  });
});
