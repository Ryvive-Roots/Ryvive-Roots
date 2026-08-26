// backend/utils/planConfig.js

export const DAYS_PER_CYCLE = 24;

// =====================================================
// STANDARD PLANS
// =====================================================

export const PLANS = {
  // ======================
  // 1 MONTH = 24 DAYS
  // ======================

  SILVER_1MONTH: {
    price: 4999,
    durationMonths: 1,
    durationDays: 24,
  },

  GOLD_1MONTH: {
    price: 5999,
    durationMonths: 1,
    durationDays: 24,
  },

  PLATINUM_1MONTH: {
    price: 6999,
    durationMonths: 1,
    durationDays: 24,
  },

  // ======================
  // 3 MONTHS = 72 DAYS
  // ======================

  SILVER_3MONTH: {
    price: 14999,
    durationMonths: 3,
    durationDays: 72,
  },

  GOLD_3MONTH: {
    price: 17499,
    durationMonths: 3,
    durationDays: 72,
  },

  PLATINUM_3MONTH: {
    price: 19999,
    durationMonths: 3,
    durationDays: 72,
  },
};


// =====================================================
// ADD-ON / CUSTOM PACKAGE PLANS
// =====================================================

export const ADD_ON_FEATURE_PLANS = {

  // SILVER

  SILVER_1MONTH_ADDON: {
    name: "Silver + Add on Features",
    basePlan: "SILVER_1MONTH",
  },

  SILVER_3MONTH_ADDON: {
    name: "Silver + Add on Features",
    basePlan: "SILVER_3MONTH",
  },


  // GOLD

  GOLD_1MONTH_ADDON: {
    name: "Gold + Add on Features",
    basePlan: "GOLD_1MONTH",
  },

  GOLD_3MONTH_ADDON: {
    name: "Gold + Add on Features",
    basePlan: "GOLD_3MONTH",
  },


  // PLATINUM

  PLATINUM_1MONTH_ADDON: {
    name: "Platinum + Add on Features",
    basePlan: "PLATINUM_1MONTH",
  },

  PLATINUM_3MONTH_ADDON: {
    name: "Platinum + Add on Features",
    basePlan: "PLATINUM_3MONTH",
  },
};


// =====================================================
// GET ADD-ON PLAN CONFIG
// =====================================================

export const getAddOnPlanConfig = (planKey) => {

  const addOnPlan = ADD_ON_FEATURE_PLANS[planKey];

  if (!addOnPlan) {
    return null;
  }

  const basePlan = PLANS[addOnPlan.basePlan];

  if (!basePlan) {
    return null;
  }

  return {
    ...addOnPlan,

    basePlanPrice: basePlan.price,
    durationMonths: basePlan.durationMonths,
    durationDays: basePlan.durationDays,
  };
};