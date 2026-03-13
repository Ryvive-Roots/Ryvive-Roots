import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BgImage from "../assets/optimized/bg.webp";

const PLAN_ORDER = ["PLATINUM", "GOLD", "SILVER"];

const PLAN_FEATURES = {
  SILVER: [
    "Clean Meals",
    "Easy Digestion",
    "Weekly Variety",
    "Functional Juices",
    "No calorie stress",
  ],
  GOLD: [
    "6 High-protein meals / week",
    "Gut & Skin-Friendly Meals",
    "Advanced energy juices",
    "Boost Energy Levels",
    "Naturally Detoxifying Ingredients",
  ],
  PLATINUM: [
    "Chef’s signature menu",
    "Glow, metabolism & recovery juices",
    "Guilt-Free Wraps & Zoodle Options",
    "Elite combinations",
    "Surprise upgrades",
  ],
};

const RENEWAL_PRICING = {
  SILVER: {
    "1": { original: 4999, discount: 0, final: 4999 },
    "3": { original: 14997, discount: 998, final: 13999 },
  },
  GOLD: {
    "1": { original: 5999, discount: 0, final: 5999 },
    "3": { original: 17997, discount: 1998, final: 15999 },
  },
  PLATINUM: {
    "1": { original: 6999, discount: 0, final: 6999 },
    "3": { original: 20997, discount: 2100, final: 18897 },
  },
};

const SubscriptionTypes = () => {

  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [duration, setDuration] = useState("3");

  const handleContinue = () => {

    if (!selectedPlan) {
      alert("Please select a plan");
      return;
    }

    navigate(`/subscription/${selectedPlan.toLowerCase()}?duration=${duration}`);
  };

  return (
    <div className="relative min-h-screen py-20 px-6">

      {/* Background */}
      <img
        src={BgImage}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-10">
          Choose Your Plan
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {PLAN_ORDER.map((plan) => {

            const prices = RENEWAL_PRICING[plan];
            const isActive = selectedPlan === plan;
            const isPremium = plan === "PLATINUM";

            return (
              <div
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`relative cursor-pointer rounded-2xl border p-6 transition-all
                ${
                  isActive
                    ? "border-green-600 bg-green-50 shadow-xl"
                    : "border-gray-200 bg-white hover:shadow-md"
                }
                ${isPremium ? "ring-2 ring-yellow-400" : ""}
                `}
              >

                {isPremium && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2
                  bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-lg font-semibold mb-4">
                  RYVIVE {plan}
                </h3>

                {/* Duration options */}

                <div className="space-y-3 mb-5">

                  {/* 1 Month */}

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan);
                      setDuration("1");
                    }}
                    className={`flex justify-between items-center rounded-xl border p-4
                    ${
                      isActive && duration === "1"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >

                    <div>
                      <p className="font-medium">1 Month</p>
                    </div>

                    <p className="font-semibold">
                      ₹{prices["1"].final.toLocaleString()}
                    </p>

                  </div>

                  {/* 3 Months */}

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan);
                      setDuration("3");
                    }}
                    className={`flex justify-between items-center rounded-xl border p-4
                    ${
                      isActive && duration === "3"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >

                    <div>
                      <p className="font-semibold text-green-700">
                        3 Months (Best Value)
                      </p>

                      <p className="text-xs line-through">
                        ₹{prices["3"].original.toLocaleString()}
                      </p>

                      <p className="text-xs text-green-700">
                        Save ₹{prices["3"].discount.toLocaleString()}
                      </p>
                    </div>

                    <p className="font-bold text-green-700">
                      ₹{prices["3"].final.toLocaleString()}
                    </p>

                  </div>

                </div>

                {/* Features */}

                <div className="text-sm space-y-2">

                  {PLAN_FEATURES[plan].map((feature, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-green-600">•</span>
                      <span>{feature}</span>
                    </div>
                  ))}

                </div>

              </div>
            );
          })}

        </div>

        {/* Continue Button */}

        <div className="flex justify-center mt-10">

          <button
            onClick={handleContinue}
            className="px-8 py-3 rounded-xl bg-green-700 text-white font-semibold shadow"
          >
            Continue
          </button>

        </div>

      </div>

    </div>
  );
};

export default SubscriptionTypes;