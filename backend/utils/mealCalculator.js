// utils/mealCalculator.js

const MEAL_DAYS_PER_MONTH = 24;

const isPausedDate = (date, pauseHistory) => {
  if (!pauseHistory?.length) return false;
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);

  return pauseHistory.some((pause) => {
    const start = new Date(pause.startDate);
    start.setHours(0, 0, 0, 0);

    let end;
    if (pause.resumeDate) {
      end = new Date(pause.resumeDate);
      end.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1); // resume date itself is NOT a pause day
    } else {
      end = new Date();
      end.setHours(0, 0, 0, 0);
    }

    return current >= start && current <= end;
  });
};

const isNoDeliveryDate = (date, noDeliveryHistory) => {
  if (!noDeliveryHistory?.length) return false;
  return noDeliveryHistory.some((item) => {
    const d = new Date(item.date);
    d.setHours(0, 0, 0, 0);
    return date.getTime() === d.getTime();
  });
};

/**
 * Mirrors client Dashboard1.js getCompletedMealDays() EXACTLY.
 * asOfDate lets admin compute "as of the delivery-log date being saved"
 * instead of always "as of right now".
 */
export const getCompletedMealDays = ({
  startDate,
  endDate,
  durationMonths = 1,
  pauseHistory = [],
  noDeliveryHistory = [],
  deliverySlot = "",
  asOfDate = new Date(),
}) => {
  if (!startDate) return { totalDays: MEAL_DAYS_PER_MONTH * durationMonths, daysCompleted: 0 };

  const totalDays = MEAL_DAYS_PER_MONTH * durationMonths;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date(asOfDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const limit = new Date(now < end ? now : end);
  limit.setHours(0, 0, 0, 0);

  // Don't count "today" until the delivery slot has passed
  let slotEndHour = 0;
  if (deliverySlot?.includes("08:00 – 09:00 AM")) slotEndHour = 9;
  else if (deliverySlot?.includes("09:00 – 10:00 AM")) slotEndHour = 10;
  else if (deliverySlot?.includes("10:00 – 11:00 AM")) slotEndHour = 11;
  else if (deliverySlot?.includes("05:00 – 06:00 PM")) slotEndHour = 18;
  else if (deliverySlot?.includes("06:00 – 07:00 PM")) slotEndHour = 19;
  else if (deliverySlot?.includes("07:00 – 08:00 PM")) slotEndHour = 20;
  else if (deliverySlot?.includes("08:00 – 09:00 PM")) slotEndHour = 21;

  const realNow = new Date();
  if (
    realNow.toDateString() === limit.toDateString() &&
    realNow.getHours() < slotEndHour
  ) {
    limit.setDate(limit.getDate() - 1);
  }

  let count = 0;
  const cursor = new Date(start);
  while (cursor <= limit) {
    if (
      cursor.getDay() !== 0 &&
      !isPausedDate(cursor, pauseHistory) &&
      !isNoDeliveryDate(cursor, noDeliveryHistory)
    ) {
      count++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  const daysCompleted = Math.min(count, totalDays);
  return { totalDays, daysCompleted };
};