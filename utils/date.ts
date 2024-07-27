export const getDateRangeUntilNow = (startDate: Date) => {
  const dates = [];
  const endDate = new Date();

  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate?.getDate() + 1);
  }

  if (dates[dates.length - 1]?.getDate() !== endDate?.getDate()) {
    dates.push(new Date(endDate));
  }

  return dates;
};
