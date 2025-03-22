import { getAllBucketFiles } from "@/actions/buckets.action";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    data: jest.fn().mockReturnValue([]),
    storage: {
      from: jest.fn().mockReturnThis(),
      list: jest.fn().mockResolvedValue({ data: [], error: null }),
    },
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("Bucket Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllBucketFiles", () => {
    const bucket = "test-bucket";
    const folder = "test-folder";

    it("should return file names from the specified bucket and folder", async () => {
      const mockFiles = [
        { name: "file1.mp4" },
        { name: "file2.mp4" },
        { name: ".emptyFolderPlaceholder" },
        { name: "file3.mp4" },
      ];

      (supabase.storage.from(bucket).list as jest.Mock).mockResolvedValueOnce({
        data: mockFiles,
        error: null,
      });

      const fileNames = await getAllBucketFiles(bucket, folder);

      expect(fileNames).toEqual(["file1.mp4", "file2.mp4", "file3.mp4"]);
    });

    it("should throw an error if there is an issue retrieving the files", async () => {
      (supabase.storage.from(bucket).list as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: new Error("List error"),
      });

      await expect(getAllBucketFiles(bucket, folder)).rejects.toThrow(
        "Impossible de récupérer les vidéos",
      );
    });

    it("should filter out empty folder placeholder files", async () => {
      const mockFiles = [
        { name: ".emptyFolderPlaceholder" },
        { name: "validFile.mp4" },
        { name: ".emptyFolderPlaceholder" },
      ];

      (supabase.storage.from(bucket).list as jest.Mock).mockResolvedValueOnce({
        data: mockFiles,
        error: null,
      });

      const fileNames = await getAllBucketFiles(bucket, folder);

      expect(fileNames).toEqual(["validFile.mp4"]);
    });
  });
});
