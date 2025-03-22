import { supabase } from "@/lib/supabase";
import { updateSrsData, postUserLearningSession } from "@/actions/srs.action";
import { State, Rating, generatorParameters, FSRSParameters, FSRS, Card } from "ts-fsrs";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn(),
    insert: jest.fn(),
    upsert: jest.fn(),
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("SRS actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateSrsData", () => {
    it("should update the SRS data when exists for a given mind and user and return the updated card's data", async () => {
      const mindId = 1;
      const userId = "user1";
      const grade = Rating.Again;
      const srsData = {
        id: 1,
        due: "2021-08-01T00:00:00.000Z",
        stability: 2,
        difficulty: 2.5,
        elapsed_days: 0,
        scheduled_days: 1,
        reps: 1,
        lapses: 0,
        last_review: "2021-07-31T00:00:00.000Z",
        state: State.Learning,
        user_id: userId,
        mind_id: mindId,
      };

      (
        supabase.from("srs_data").select("*").eq("mind_id", mindId).eq("user_id", userId)
          .maybeSingle as jest.Mock
      ).mockResolvedValueOnce({ data: srsData, error: null });

      (supabase.from("srs_data").insert as jest.Mock).mockResolvedValueOnce({ error: null });

      (supabase.from("srs_data").upsert as jest.Mock).mockResolvedValueOnce({ error: null });

      const result = await updateSrsData(mindId, userId, grade);

      const card = {
        reps: srsData?.reps ?? 0,
        lapses: srsData?.lapses ?? 0,
        stability: srsData?.stability ?? 0,
        difficulty: srsData?.difficulty ?? 0,
        elapsed_days: srsData?.elapsed_days ?? 0,
        scheduled_days: srsData?.scheduled_days ?? 0,
        state: srsData?.state ?? State.New.valueOf(),
        due: srsData?.due ? new Date(srsData.due) : new Date(),
        last_review: srsData?.last_review ? new Date(srsData.last_review) : undefined,
      } as Card;

      const params: FSRSParameters = generatorParameters();
      const f: FSRS = new FSRS(params);
      const schedulingResult = f.next(card, new Date(), grade);
      const updatedCard = schedulingResult.card;

      expect(supabase.from).toHaveBeenCalledWith("srs_data");
      expect(supabase.from("srs_data").select).toHaveBeenCalledWith("*");
      expect(supabase.from("srs_data").select("*").eq).toHaveBeenCalledWith("mind_id", mindId);
      expect(supabase.from("srs_data").select("*").eq("mind_id", mindId).eq).toHaveBeenCalledWith(
        "user_id",
        userId,
      );
      expect(supabase.from("srs_data").insert).not.toHaveBeenCalled();
      expect(supabase.from("srs_data").upsert).toHaveBeenCalledWith({
        due: expect.any(String),
        stability: updatedCard.stability,
        difficulty: updatedCard.difficulty,
        elapsed_days: updatedCard.elapsed_days,
        scheduled_days: updatedCard.scheduled_days,
        reps: updatedCard.reps,
        lapses: updatedCard.lapses,
        last_review: expect.any(String),
        state: updatedCard.state,
        user_id: userId,
        mind_id: mindId,
      });

      expect(result).toEqual(
        expect.objectContaining({
          ...updatedCard,
          due: expect.any(Date),
          last_review: expect.any(Date),
        }),
      );

      expect(result.due.getTime()).toBeCloseTo(updatedCard.due.getTime(), -20);
      expect(result.last_review?.getTime()).toBeCloseTo(
        updatedCard.last_review?.getTime() as number,
        -20,
      );
    });

    it("should create the SRS data when doesn't exist for a given mind and user and return the created card's data", async () => {
      const mindId = 1;
      const userId = "user1";
      const grade = Rating.Again;

      (
        supabase.from("srs_data").select("*").eq("mind_id", mindId).eq("user_id", userId)
          .maybeSingle as jest.Mock
      ).mockResolvedValueOnce({ data: null, error: null });

      (supabase.from("srs_data").insert as jest.Mock).mockResolvedValueOnce({ error: null });

      (supabase.from("srs_data").upsert as jest.Mock).mockResolvedValueOnce({ error: null });

      const result = await updateSrsData(mindId, userId, grade);

      const emptyCard = {
        reps: 0,
        lapses: 0,
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        state: State.New.valueOf(),
        due: new Date(),
        last_review: undefined,
      } as Card;

      const params: FSRSParameters = generatorParameters();
      const f: FSRS = new FSRS(params);
      const schedulingResult = f.next(emptyCard, new Date(), grade);
      const updatedCard = schedulingResult.card;

      expect(supabase.from).toHaveBeenCalledWith("srs_data");
      expect(supabase.from("srs_data").select).toHaveBeenCalledWith("*");
      expect(supabase.from("srs_data").select("*").eq).toHaveBeenCalledWith("mind_id", mindId);
      expect(supabase.from("srs_data").select("*").eq("mind_id", mindId).eq).toHaveBeenCalledWith(
        "user_id",
        userId,
      );
      expect(supabase.from("srs_data").insert).toHaveBeenCalledWith({
        due: expect.any(String),
        stability: emptyCard.stability,
        difficulty: emptyCard.difficulty,
        elapsed_days: emptyCard.elapsed_days,
        scheduled_days: emptyCard.scheduled_days,
        reps: emptyCard.reps,
        lapses: emptyCard.lapses,
        last_review: undefined,
        state: emptyCard.state,
        user_id: userId,
        mind_id: mindId,
      });
      expect(supabase.from("srs_data").upsert).toHaveBeenCalledWith({
        due: expect.any(String),
        stability: updatedCard.stability,
        difficulty: updatedCard.difficulty,
        elapsed_days: updatedCard.elapsed_days,
        scheduled_days: updatedCard.scheduled_days,
        reps: updatedCard.reps,
        lapses: updatedCard.lapses,
        last_review: expect.any(String),
        state: updatedCard.state,
        user_id: userId,
        mind_id: mindId,
      });

      expect(result).toEqual(
        expect.objectContaining({
          ...updatedCard,
          due: expect.any(Date),
          last_review: expect.any(Date),
        }),
      );

      expect(result.due.getTime()).toBeCloseTo(updatedCard.due.getTime(), -20);
      expect(result.last_review?.getTime()).toBeCloseTo(
        updatedCard?.last_review?.getTime() as number,
        -20,
      );
    });

    it("should throw an error if the SRS data can't be get", async () => {
      const mindId = 1;
      const userId = "user1";
      const grade = Rating.Again;
      const error = new Error("error");

      (
        supabase.from("srs_data").select("*").eq("mind_id", mindId).eq("user_id", userId)
          .maybeSingle as jest.Mock
      ).mockResolvedValueOnce({ data: null, error: error });

      await expect(updateSrsData(mindId, userId, grade)).rejects.toThrow(
        "Erreur lors de la récupération des données SRS",
      );

      expect(console.error).toHaveBeenCalledWith(
        "Erreur lors de la récupération des données SRS",
        error,
      );
    });

    it("should throw an error if the SRS data can't be inserted", async () => {
      const mindId = 1;
      const userId = "user1";
      const grade = Rating.Again;

      (
        supabase.from("srs_data").select("*").eq("mind_id", mindId).eq("user_id", userId)
          .maybeSingle as jest.Mock
      ).mockResolvedValueOnce({ data: null, error: null });

      const error = new Error("error");

      (supabase.from("srs_data").insert as jest.Mock).mockResolvedValueOnce({ error });

      await expect(updateSrsData(mindId, userId, grade)).rejects.toThrow(
        "Erreur lors de la création des données SRS",
      );

      expect(console.error).toHaveBeenCalledWith(
        "Erreur lors de la création des données SRS",
        error,
      );
    });

    it("should throw an error if the SRS data can't be updated", async () => {
      const mindId = 1;
      const userId = "user1";
      const grade = Rating.Again;
      const srsData = {
        id: 1,
        due: "2021-08-01T00:00:00.000Z",
        stability: 2,
        difficulty: 2.5,
        elapsed_days: 0,
        scheduled_days: 1,
        reps: 1,
        lapses: 0,
        last_review: "2021-07-31T00:00:00.000Z",
        state: State.Learning,
        user_id: userId,
        mind_id: mindId,
      };

      (
        supabase.from("srs_data").select("*").eq("mind_id", mindId).eq("user_id", userId)
          .maybeSingle as jest.Mock
      ).mockResolvedValueOnce({ data: srsData, error: null });

      const error = new Error("error");

      (supabase.from("srs_data").upsert as jest.Mock).mockResolvedValueOnce({ error });

      await expect(updateSrsData(mindId, userId, grade)).rejects.toThrow(
        "Erreur lors de la mise à jour des données SRS",
      );

      expect(console.error).toHaveBeenCalledWith(
        "Erreur lors de la mise à jour des données SRS",
        error,
      );
    });
  });

  describe("postUserLearningSession", () => {
    it("should post a user's learning session and return the created session's data", async () => {
      const totalTimeInMs = 1000;
      const totalLength = 10;
      const userId = "user1";

      (supabase.from("learning_sessions").insert as jest.Mock).mockResolvedValueOnce({
        error: null,
      });

      const result = await postUserLearningSession(totalTimeInMs, totalLength, userId);

      expect(supabase.from).toHaveBeenCalledWith("learning_sessions");
      expect(supabase.from("learning_sessions").insert).toHaveBeenCalledWith({
        total_time: totalTimeInMs,
        total_length: totalLength,
        user_id: userId,
      });
      expect(result).toEqual({ success: true });
    });

    it("should throw an error if the learning session can't be posted", async () => {
      const totalTimeInMs = 1000;
      const totalLength = 10;
      const userId = "user1";
      const error = new Error("error");

      (supabase.from("learning_sessions").insert as jest.Mock).mockResolvedValueOnce({
        error,
      });

      await expect(postUserLearningSession(totalTimeInMs, totalLength, userId)).rejects.toThrow(
        "Erreur lors de la création de la session",
      );

      expect(console.error).toHaveBeenCalledWith("Erreur lors de la création de la session", error);
    });
  });
});
