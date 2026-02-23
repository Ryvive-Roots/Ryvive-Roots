export const WEEKLY_MENU = {
  SILVER: {
    week1: {
      Monday: "Healthy Heart",
      Tuesday: "Chilli Crunch Salad",
      Wednesday: "Paneer Crunch Wrap + Orange Pine Twist",
      Thursday: "Chickpea Paneer Fusion",
      Friday: "Corn N Cheese Chaat",
      Saturday: "Veg Protein Supreme Wrap + Golden Pine",
    },
    week2: {
      Monday: "Stamina Booster",
      Tuesday: "Creamy Double Chickpea",
      Wednesday: "Beetroot Cheese Wrap + Calm Cucumber",
      Thursday: "Rajma Paneer Power lean",
      Friday: "Soya Protein Wrap + Ryvive Carrot",
      Saturday: "Immuni Boost plus",
    },
    week3: {
      Monday: "Red Ryvive",
      Tuesday: "Corn Paneer Balance Bowl",
      Wednesday: "Sprout Energy Wrap + Dr. Carrot",
      Thursday: "Roasted Zucchini Bowl",
      Friday: "Sprout Supreme Chaat",
      Saturday: "Spinach Corn Cheese Wrap + Beet Blend",
    },
    week4: {
      Monday: "APB Shake",
      Tuesday: "High Protein Paneer Salad",
      Wednesday: "Spinach Corn Cheese Wrap + Beet Blend",
      Thursday: "Chilli Lime Soya Salad",
      Friday: "Soya Protein Wrap + Ryvive Carrot",
      Saturday: "Sweet Potato & Pea Chaat",
    },
  },

  GOLD: {
    week1: {
      Monday: "Classic Veggie Bowl",
      Tuesday: "Immuni Boost Plus + High-Protein Soya Cheese Wrap",
      Wednesday: "Dragon Pine",
      Thursday: "Roasted Zucchini Bowl",
      Friday: "Stamina Booster + Corn N’ Cheese Chaat",
      Saturday: "Avocado Paneer Royal Grill",
    },
    week2: {
      Monday: "Creamy Double Chickpea",
      Tuesday: "Calm Cucumber + Paneer Crunch Cheese Wrap",
      Wednesday: "Libido Booster",
      Thursday: "Rajma Paneer Power Lean",
      Friday: "For Skin Sake + Sweet N’ Fresh Corn",
      Saturday: "The Pesto Zoodle Hour",
    },
    week3: {
      Monday: "Mexican Avocado Salad",
      Tuesday: "Red Ryvive + Chickpea Avocado Cheese Wrap",
      Wednesday: "Pomegranate Delight",
      Thursday: "Broccoli Cashew Cream",
      Friday: "Happy Gut + Sweet Potato & Pea",
      Saturday: "Garlic Mushroom & Veggie Melt",
    },
    week4: {
      Monday: "High Protein Black Chana",
      Tuesday: "Orange Pine Twist + High Protein Soya Cheese Wrap",
      Wednesday: "Dragon Delight",
      Thursday: "Green Garden Bowl",
      Friday: "Ryvive Carrot + Sweet N’ Fresh Corn",
      Saturday: "The Zoodle Flame",
    },
  },

  PLATINUM: {
    week1: {
      Monday: "High Protein Paneer Salad",
      Tuesday: "Dragon Delight + Beetroot Cheese Wrap",
      Wednesday: "The Pesto Zoodle Hour + Pomegranate Delight",
      Thursday: "Mexican Avocado Salad",
      Friday: "Orange Pine Twist + Sweet Potato & Pea",
      Saturday: "Green Garden Bowl",
    },
    week2: {
      Monday: "Broccoli Cashew Cream",
      Tuesday: "O-Juice + Paneer Crunch Wrap",
      Wednesday: "The Zoodle Flame + Libido Booster",
      Thursday: "Chickpea Paneer Fusion",
      Friday: "Dragon Pine + Corn N’ Cheese",
      Saturday: "Thai Mushroom Salad",
    },
    week3: {
      Monday: "Chilli Lime Soya Salad",
      Tuesday: "Dragon Delight + Beetroot Cheese Wrap",
      Wednesday: "The Pesto Zoodle Hour + Pomegranate Delight",
      Thursday: "Signature Twin Plus",
      Friday: "Orange Pine Twist + Sweet Potato & Pea",
      Saturday: "Sweet Potato Bliss",
    },
    week4: {
      Monday: "Creamy Double Chickpea",
      Tuesday: "Avocado Smoothie + Paneer Crunch Wrap",
      Wednesday: "The Zoodle Flame + Libido Booster",
      Thursday: "Rajma Paneer Power Lean",
      Friday: "Bright Eyes + Corn N’ Cheese",
      Saturday: "Chilli Crunch Salad",
    },
  },
};

export const getCurrentWeekNumber = (activationDate) => {
  if (!activationDate) return 1;

  const start = new Date(activationDate);
  const now = new Date();

  const diffDays = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const week = Math.floor(diffDays / 7) + 1;

  return ((week - 1) % 4) + 1;
};