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
  // 3 MONTH PLANS (72 days)
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
// ADD-ON / CUSTOMIZED PACKAGES
// =====================================================
//
// IMPORTANT:
// These are only package definitions.
// Add-on/custom price will be entered manually
// by the admin.
//
// Base price and duration come from PLANS above.
// =====================================================

export const ADD_ON_FEATURE_PLANS = {

  // ======================
  // SILVER
  // ======================

  SILVER_1MONTH_ADDON: {
    name: "Silver + Add on Features",
    basePlan: "SILVER_1MONTH",
  },

  SILVER_3MONTH_ADDON: {
    name: "Silver + Add on Features",
    basePlan: "SILVER_3MONTH",
  },


  // ======================
  // GOLD
  // ======================

  GOLD_1MONTH_ADDON: {
    name: "Gold + Add on Features",
    basePlan: "GOLD_1MONTH",
  },

  GOLD_3MONTH_ADDON: {
    name: "Gold + Add on Features",
    basePlan: "GOLD_3MONTH",
  },


  // ======================
  // PLATINUM
  // ======================

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

export const getAddOnPlanConfig = (
  planKey,
  durationMonths = 1
) => {

  let resolvedPlanKey = planKey;


  // ===================================================
  // SUPPORT OLD FRONTEND ADD-ON KEYS
  // ===================================================
  //
  // Old frontend:
  //
  // SILVER_ADDON
  // GOLD_ADDON
  // PLATINUM_ADDON
  //
  // We automatically convert them according to
  // the selected duration.
  // ===================================================

  const oldAddonMap = {

    SILVER_ADDON: {
      1: "SILVER_1MONTH_ADDON",
      3: "SILVER_3MONTH_ADDON",
    },

    GOLD_ADDON: {
      1: "GOLD_1MONTH_ADDON",
      3: "GOLD_3MONTH_ADDON",
    },

    PLATINUM_ADDON: {
      1: "PLATINUM_1MONTH_ADDON",
      3: "PLATINUM_3MONTH_ADDON",
    },

  };


  // ===================================================
  // IF OLD KEY IS RECEIVED
  // ===================================================

  if (oldAddonMap[planKey]) {

    const selectedDuration =
      Number(durationMonths) === 3
        ? 3
        : 1;


    resolvedPlanKey =
      oldAddonMap[planKey][selectedDuration];

  }


  // ===================================================
  // FIND ADD-ON CONFIG
  // ===================================================

  const addOnPlan =
    ADD_ON_FEATURE_PLANS[
      resolvedPlanKey
    ];


  if (!addOnPlan) {
    return null;
  }


  // ===================================================
  // FIND BASE PLAN
  // ===================================================

  const basePlan =
    PLANS[
      addOnPlan.basePlan
    ];


  if (!basePlan) {
    return null;
  }


  // ===================================================
  // RETURN COMPLETE CONFIG
  // ===================================================

  return {

    ...addOnPlan,

    // Automatically comes from PLANS

    basePlanPrice:
      basePlan.price,

    durationMonths:
      basePlan.durationMonths,

    durationDays:
      basePlan.durationDays,

  };

};