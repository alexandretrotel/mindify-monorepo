import { supabase } from "@/lib/supabase";
import { getSummariesCountByTopic, getTopicName, getTopics } from "@/actions/topics.action";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn(),
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("Topics Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTopicName", () => {
    it("should return the name of a topic by its ID", async () => {
      const topicId = 1;
      const topicName = "topic";

      (
        supabase.from("topics").select("id, name").eq("id", topicId).maybeSingle as jest.Mock
      ).mockResolvedValue({
        data: { name: topicName },
        error: null,
      });

      const result = await getTopicName(topicId);

      expect(supabase.from).toHaveBeenCalledWith("topics");
      expect(supabase.from("topics").select).toHaveBeenCalledWith("id, name");
      expect(supabase.from("topics").select("id, name").eq).toHaveBeenCalledWith("id", topicId);
      expect(
        supabase.from("topics").select("id, name").eq("id", topicId).maybeSingle,
      ).toHaveBeenCalled();
      expect(result).toEqual(topicName);
    });

    it("should return 'Thème' if the topic can't be fetched", async () => {
      const topicId = 1;

      (
        supabase.from("topics").select("id, name").eq("id", topicId).maybeSingle as jest.Mock
      ).mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await getTopicName(topicId);

      expect(supabase.from).toHaveBeenCalledWith("topics");
      expect(supabase.from("topics").select).toHaveBeenCalledWith("id, name");
      expect(supabase.from("topics").select("id, name").eq).toHaveBeenCalledWith("id", topicId);
      expect(
        supabase.from("topics").select("id, name").eq("id", topicId).maybeSingle,
      ).toHaveBeenCalled();
      expect(result).toEqual("Thème");
    });

    it("should throw an error if the topic can't be fetched", async () => {
      const topicId = 1;
      const error = new Error("Error fetching topic");

      (
        supabase.from("topics").select("id, name").eq("id", topicId).maybeSingle as jest.Mock
      ).mockResolvedValue({
        data: null,
        error,
      });

      await expect(getTopicName(topicId)).rejects.toThrow(
        "Une erreur est survenue lors de la récupération du nom de topic.",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getTopics", () => {
    it("should return an array of topics", async () => {
      const topics = [{ id: 1, name: "topic" }];
      (supabase.from("topics").select("*").eq as jest.Mock).mockResolvedValue({ data: topics });

      const result = await getTopics();

      expect(supabase.from("topics").select("*").eq).toHaveBeenCalledWith("production", true);
      expect(result).toEqual(topics);
    });

    it("should throw an error if the topics can't be fetched", async () => {
      const error = new Error("Error fetching topics");
      (supabase.from("topics").select("*").eq as jest.Mock).mockResolvedValue({ error });

      await expect(getTopics()).rejects.toThrow(
        "Une erreur est survenue lors de la récupération des topics",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getSummariesCountByTopic", () => {
    it("should return a record of topic IDs and their respective number of summaries", async () => {
      const summaries = [{ topic_id: 1 }, { topic_id: 2 }, { topic_id: 1 }, { topic_id: 3 }];

      (supabase.from("summaries").select("topic_id").eq as jest.Mock).mockResolvedValue({
        data: summaries,
        error: null,
      });

      const result = await getSummariesCountByTopic();

      expect(supabase.from("summaries").select("topic_id").eq).toHaveBeenCalledWith(
        "production",
        true,
      );
      expect(result).toEqual({ 1: 2, 2: 1, 3: 1 });
    });

    it("should throw an error if the summaries can't be fetched", async () => {
      const error = new Error("Error fetching summaries");
      (supabase.from("summaries").select("topic_id").eq as jest.Mock).mockResolvedValue({ error });

      await expect(getSummariesCountByTopic()).rejects.toThrow(
        "Une erreur est survenue lors de la récupération des thèmes",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });
});
