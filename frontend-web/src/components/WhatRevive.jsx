import { useState } from "react";

export default function WhatIsRyviveRoots() {
  const [showMore, setShowMore] = useState(false);

  const paragraphs = [
    "Ryvive Roots was born with one clear intention: to help people take control of their health through real, functional food. In today’s fast-paced world, fatigue, stress, bloating, and low energy have become everyday realities. We often try to fix them with quick solutions or supplements, without realising that the true cause and the real cure lies in what we eat.",
    "At Ryvive Roots, we believe food is more than fuel. Every meal we serve is created with intention: to support your body, mind, and overall well-being in the most natural and sustainable way possible.",
    "We bring together modern nutritional science and the wisdom of natural living to create food that works with your body, not against it. Each recipe at Ryvive Roots is thoughtfully designed with an understanding of how your body functions—how nutrients interact, how digestion influences mood and immunity, and how balanced meals can build long-term vitality. Our goal is not to follow diets or trends but to provide sustainable nourishment that helps you feel better from within. Whether it’s improving digestion, boosting metabolism, supporting mental clarity, or enhancing recovery—our food is created to nurture every part of you. We don’t guess nutrition—we understand it. And every dish we serve is a reflection of that understanding.",
    "At Ryvive Roots, everything begins with one simple principle—keep it real. We use natural, wholesome ingredients and craft everything in-house to maintain purity, freshness, and integrity. From our wraps to our smoothies, from our sauces to our bowls—everything is created thoughtfully, ensuring it adds genuine value to your body. No shortcuts. No processed fillers. No artificial anything. Just honest food that lets nature do what it does best—heal, energize, and nourish.",
    "Our food philosophy is built on one idea—alignment. We design every meal to support your body’s natural rhythm—to awaken, sustain, and restore you through the day. Each offering is crafted with functional balance in mind, ensuring the right mix of nutrients in the most natural form. We don’t believe in calorie counting or restrictive eating. We believe in intelligent nourishment—feeding your body what it truly needs to thrive, not just survive. When your food works with your body, healing becomes effortless, energy feels natural, and wellness becomes a way of life.",
    "Clean eating at Ryvive Roots is not a label—it’s our foundation. Every element of our menu is made fresh and from scratch, with transparency and care. We believe food should be alive—rich in nutrients, enzymes, and energy that your body can actually use. By avoiding the artificial and staying true to the authentic, we ensure that every meal not only tastes good but also makes you feel good from the inside out. Clean food isn’t about restriction; it’s about respecting your body and giving it what it truly deserves.",
    "Ryvive Roots was created for people who are ready to take charge of their health naturally. We understand that health isn’t just about the absence of illness; it’s about energy, balance, and clarity. Whether you’re struggling with low energy, digestive discomfort, hormonal imbalance, or just want to feel lighter and more alive—our food is designed to support that journey. We don’t promise quick fixes. We promise progress, awareness, and consistency—one mindful meal at a time. Because we believe food, when made right, is the most powerful form of preventive care.",
    "Every recipe at Ryvive Roots is developed with care and backed by intention. We take the time to prepare, combine, and balance ingredients in ways that preserve their nutritional value and enhance their effectiveness. Our team of culinary experts and nutrition specialists work together to ensure that each dish not only satisfies your palate but also supports your health. We don’t chase food trends; we build timeless food principles. Our menu evolves with the seasons, ensuring your body receives what it truly needs at the right time of year.",
  ];

  const visibleParagraphs = showMore ? paragraphs : paragraphs.slice(0, 3);

  return (
    <div className="w-full md:w-1/2 ">
      <h1 className="md:text-2xl lg:text-3xl text-xl font-cinzel uppercase font-semibold text-[#895C40]">
        What is Ryvive Roots?
      </h1>

      <p  className="  text-sm font-roboto py-2">
        Ryvive Roots is an invitation to return to what is pure, grounded, and
        real. Born from a respect for nature and the body’s innate wisdom, every
        dish is prepared from scratch using clean, carefully chosen ingredients
        that nourish without excess and restore without force. Free from
        artificial flavours, preservatives, and shortcuts, our food is designed
        to move in harmony with your natural rhythm—awakening energy, sustaining
        balance, and leaving you feeling light, clear, and renewed. We don’t
        chase trends or promise quick fixes; we offer thoughtful nourishment,
        crafted with care, meant to support a refined way of living where
        wellness feels effortless and enduring.
      </p>

    
    </div>
  );
}
