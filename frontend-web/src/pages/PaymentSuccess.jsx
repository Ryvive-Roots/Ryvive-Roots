import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [membershipId, setMembershipId] = useState("");
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mid = params.get("membershipId");

    if (!mid) {
      navigate("/");
      return;
    }

    setMembershipId(mid);

    // clear saved form data
    localStorage.removeItem("subscriptionFormData");
    localStorage.removeItem("subscriptionDeliverySlot");
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={300}
        recycle={false}
      />

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">

        <CheckCircle
          size={90}
          className="mx-auto text-green-500 mb-4 animate-bounce"
        />

        <h2 className="text-2xl font-semibold">
          Payment Successful 🎉
        </h2>

        <p className="text-gray-500 mt-2">
          Your subscription has been activated.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
          <p className="text-sm text-gray-500">Membership ID</p>
          <p className="text-xl font-bold text-green-700">
            {membershipId}
          </p>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
        >
          Go to Login
        </button>

      </div>
    </div>
  );
};

export default PaymentSuccess;