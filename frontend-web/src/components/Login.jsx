import { useState, useEffect } from "react";
import Bg from "../assets/BgSignIn.jpeg";


const Login = () => {
  const [membershipId, setMembershipId] = useState("");
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  

const handleLogin = async () => {
  if (!membershipId || !identifier) {
    alert("Please enter Membership ID and Email or Phone");
    return;
  }

  try {
    setLoading(true);
    setError(""); // clear old error

    const res = await fetch("https://api.ryviveroots.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        membershipId,
        identifier,
      }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token", "loggedin");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("membershipId", data.membershipId);

      window.location.href = "/dashboard";
    } else {
      setError("invalid"); // 👈 trigger error
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    alert("Server error. Try again.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const savedMembershipId = localStorage.getItem("membershipId");

    if (savedMembershipId) {
      setMembershipId(savedMembershipId);
    }
  }, []);


  return (
    <div className="relative mt-28 font-merriweather min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* 🔹 BLURRED BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
       
      ></div>

      {/* 🔹 DARK OVERLAY */}
      <div className="absolute inset-0 bg-white text-black"></div>

      {/* 🔹 LOGIN CARD */}
      <div
        className="
          relative 
          w-full 
          max-w-sm sm:max-w-md md:max-w-lg
          bg-white/20 
          rounded-2xl 
          p-6 sm:p-8 md:p-10 
          shadow-2xl
        "
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-black text-center">
          Welcome Back!
        </h2>

        <p className="text-black text-center mt-4">
          Login using Membership ID and Email / Phone
        </p>

        {/* LOGIN FORM */}
        <div className="mt-6 space-y-5 text-black">
          {/* Membership ID */}
         <input
  placeholder="Membership ID"
  value={membershipId}
  onChange={(e) => setMembershipId(e.target.value)}
  className="
    w-full px-4 py-3 
    bg-transparent
    border border-black 
    rounded-full 
    text-black
    placeholder-white
    focus:ring-2 focus:ring-[#895C40] outline-none
  "
/>


          {/* Email or Phone */}
         <input
  placeholder="Email or Phone"
  value={identifier}
  onChange={(e) => {
    setIdentifier(e.target.value);
    setError(""); // 👈 clears error while typing
  }}
  className="
    w-full px-4 py-3 
    bg-transparent 
    border border-black 
    rounded-full 
    placeholder-black
    focus:ring-2 focus:ring-[#895C40] outline-none
  "
/>
        {error === "invalid" && (
  <p className="text-xs text-red-500 mt-1 text-center">
    ⚠️ Please enter your <b>registered Email ID or Phone Number</b>.
  </p>
)}

          {/* Login Button */}
          <button
            disabled={loading}
            onClick={handleLogin}
            className="
              w-full py-3 
             bg-[#0d2009]
              rounded-full
              font-semibold
              text-[#C9A666]
              transition
              disabled:opacity-60
            "
          >
            {loading ? "Logging in..." : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
