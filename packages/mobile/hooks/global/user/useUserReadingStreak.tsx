import { getUserReadSummariesTimpestamps } from "@/actions/users.action";
import { useEffect, useState } from "react";
import { summary } from "date-streaks";

const getFrenchDay = (date: Date) => {
  return date.toLocaleDateString("fr-FR", { weekday: "short" });
};

/**
 * Custom hook to fetch and manage user reading streak
 *
 * @param userId The user id to fetch reading streak from
 * @returns An object containing the user reading streak and some functions to manage it
 */
export default function useUserReadingStreak(userId: string | null) {
  const [readingStreak, setReadingStreak] = useState(0);
  const [readingDays, setReadingDays] = useState<boolean[]>([]);
  const [readingData, setReadingData] = useState<
    {
      read_at: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [daysInFrench, setDaysInFrench] = useState<string[]>([]);

  useEffect(() => {
    const fetchReadingStreak = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        const readingData = await getUserReadSummariesTimpestamps(userId);
        setReadingData(readingData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingStreak();
  }, [userId]);

  useEffect(() => {
    if (readingData?.length === 0) return;

    const dates = readingData?.map((data) => new Date(data.read_at)) ?? [];

    const streak = summary({ dates });

    const readingStreak = streak.currentStreak;

    setReadingStreak(readingStreak);
  }, [readingData]);

  useEffect(() => {
    if (!readingData?.length) return;

    const readingDays = new Array(7).fill(false);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date?.getDate() - i);
      days.push(date);
    }

    const reversedDays = [...days]?.reverse();
    const frenchDays = reversedDays?.map((day) => getFrenchDay(day));

    reversedDays?.forEach((day, index) => {
      const isReadingDay = readingData?.some((data) => {
        const readDate = new Date(data.read_at);
        return (
          readDate.getDate() === day.getDate() &&
          readDate.getMonth() === day.getMonth() &&
          readDate.getFullYear() === day.getFullYear()
        );
      });

      readingDays[index] = isReadingDay;
    });

    setReadingDays(readingDays);
    setDaysInFrench(frenchDays);
  }, [readingData]);

  return { readingStreak, readingDays, loading, daysInFrench, readingData };
}
