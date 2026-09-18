import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const seoData = {
  "/": {
    title: "Ryvive Roots | Healthy Food & Diet Meals in Dombivali",
    description:
      "Ryvive Roots serves fresh, nutritious and delicious healthy meals in Dombivali for a balanced and healthier lifestyle.",
    index: true,
  },

  "/story": {
    title: "Our Story | Ryvive Roots",
    description:
      "Learn the story behind Ryvive Roots and our mission to make healthy, nutritious food delicious and accessible.",
    index: true,
  },

  "/menu": {
    title: "Healthy Food Menu in Dombivali | Ryvive Roots",
    description:
      "Explore the Ryvive Roots menu featuring fresh, nutritious and delicious healthy meals in Dombivali.",
    index: true,
  },

  "/subscription": {
    title: "Healthy Meal Subscription in Dombivali | Ryvive Roots",
    description:
      "Explore healthy meal subscriptions, office lunch plans, high-protein meals and customized diet meal plans from Ryvive Roots.",
    index: true,
  },

  "/franchise": {
    title: "Franchise Opportunities | Ryvive Roots",
    description:
      "Explore franchise opportunities with Ryvive Roots and join our growing healthy food business.",
    index: true,
  },

  "/career": {
    title: "Careers | Ryvive Roots",
    description:
      "Explore career opportunities at Ryvive Roots and become part of our healthy food and nutrition-focused team.",
    index: true,
  },

  "/contact": {
    title: "Contact Ryvive Roots | Healthy Food in Dombivali",
    description:
      "Contact Ryvive Roots for healthy meals, subscriptions, customized diet plans and other enquiries.",
    index: true,
  },

  "/login": {
    title: "Login | Ryvive Roots",
    description:
      "Login to your Ryvive Roots account.",
    index: false,
  },

  "/dashboard": {
    title: "Dashboard | Ryvive Roots",
    description:
      "Ryvive Roots customer dashboard.",
    index: false,
  },

  "/PrivacyPolicy": {
    title: "Privacy Policy | Ryvive Roots",
    description:
      "Read the Privacy Policy of Ryvive Roots.",
    index: true,
  },

  "/TermsConditions": {
    title: "Terms & Conditions | Ryvive Roots",
    description:
      "Read the Terms and Conditions of Ryvive Roots.",
    index: true,
  },

  "/CancellationRefundPolicy": {
    title: "Cancellation & Refund Policy | Ryvive Roots",
    description:
      "Read the Cancellation and Refund Policy of Ryvive Roots.",
    index: true,
  },

  "/Shipping&DeliveryPolicy": {
    title: "Shipping & Delivery Policy | Ryvive Roots",
    description:
      "Read the Shipping and Delivery Policy of Ryvive Roots.",
    index: true,
  },
};

export default function SEO() {
  const location = useLocation();

  const pathname = location.pathname;

  const data = seoData[pathname] || seoData["/"];

  const canonicalUrl =
    pathname === "/"
      ? "https://www.ryviveroots.com/"
      : `https://www.ryviveroots.com${pathname}`;

  useEffect(() => {
    // Update page title
    document.title = data.title;

    // Update description
    let description = document.querySelector(
      'meta[name="description"]'
    );

    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }

    description.setAttribute("content", data.description);

    // Update robots
    let robots = document.querySelector(
      'meta[name="robots"]'
    );

    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }

    robots.setAttribute(
      "content",
      data.index ? "index, follow" : "noindex, nofollow"
    );

    // Update canonical
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalUrl);

    // Update Open Graph title
    let ogTitle = document.querySelector(
      'meta[property="og:title"]'
    );

    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }

    ogTitle.setAttribute("content", data.title);

    // Update Open Graph description
    let ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );

    if (!ogDescription) {
      ogDescription = document.createElement("meta");
      ogDescription.setAttribute(
        "property",
        "og:description"
      );
      document.head.appendChild(ogDescription);
    }

    ogDescription.setAttribute(
      "content",
      data.description
    );
  }, [pathname, data.title, data.description, data.index, canonicalUrl]);

  return null;
}