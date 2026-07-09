// backend/utils/planConfig.js

export const DAYS_PER_CYCLE = 24; // 1 subscription "month" = 24 days, always

export const PLANS = {
  // ======================
  // 1 MONTH PLANS (24 days)
  // ======================
  SILVER_1MONTH: {
    price: 4999,
    durationMonths: 1,
    durationDays: 24,
  },
  GOLD_1MONTH: {
    price: 1,
    durationMonths: 1,
    durationDays: 24,
  },
  PLATINUM_1MONTH: {
    price: 6999,
    durationMonths: 1,
    durationDays: 24,
  },

  // ======================
  // 3 MONTH PLANS (72 days)
  // ======================
  SILVER_3MONTH: {
    price: 14999,
    durationMonths: 3,
    durationDays: 72,
  },
  GOLD_3MONTH: {
    price: 1,
    durationMonths: 3,
    durationDays: 72,
  },
  PLATINUM_3MONTH: {
    price: 2,
    durationMonths: 3,
    durationDays: 72,
  },
};