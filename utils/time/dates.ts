import { TimeLeft } from "@/types/time/dates";

export function calculateTimeLeft(launchDate: Date): TimeLeft {
  const difference = launchDate.getTime() - Date.now();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  if (difference > 0) {
    timeLeft.days = Math.floor(difference / (1000 * 60 * 60 * 24));
    timeLeft.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    timeLeft.minutes = Math.floor((difference / (1000 * 60)) % 60);
    timeLeft.seconds = Math.floor((difference / 1000) % 60);

    if (timeLeft.days > 0 && timeLeft.hours === 0) {
      timeLeft.hours = 23;
      timeLeft.days -= 1;
    }

    if (timeLeft.hours > 0 && timeLeft.minutes === 0) {
      timeLeft.minutes = 59;
      timeLeft.hours -= 1;
    }

    if (timeLeft.minutes > 0 && timeLeft.seconds === 0) {
      timeLeft.seconds = 59;
      timeLeft.minutes -= 1;
    }
  }

  return timeLeft;
}
