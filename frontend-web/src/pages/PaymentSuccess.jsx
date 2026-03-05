import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const membershipId = params.get("membershipId");
    const plan = params.get("plan");

    if (!membershipId || !plan) {
      navigate("/");
      return;
    }

    let page = "";

    if (plan.includes("PLATINUM")) page = "subscription-platinum";
    if (plan.includes("GOLD")) page = "subscription-gold";
    if (plan.includes("SILVER")) page = "subscription-silver";

    navigate(`/${page}?membershipId=${membershipId}`, { replace: true });

  }, [location.search, navigate]);

  return null;
};

export default PaymentSuccess;