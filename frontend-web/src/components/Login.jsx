import { useState, useEffect } from "react";
import Bg from "../assets/BgSignIn.jpeg";


const Login = () => {
  const [membershipId, setMembershipId] = useState("");
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [loading, setLoading] = useState(false);

  

  const handleLogin = async () => {
    if (!membershipId || !identifier) {
      alert("Please enter Membership ID and Email or Phone");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId,
          identifier,
        }),
      });

      const data = await res.json();

      console.log("✅ LOGIN RESPONSE:", data); // 👈 ADD THIS

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("membershipId", data.membershipId);

        console.log("➡️ Redirecting to /dashboard...");
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Invalid login details");
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
        style={{
          backgroundImage: `url(${Bg})`,
          filter: "blur(6px)",
        }}
      ></div>

      {/* 🔹 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40"></div>

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
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
          Welcome Back!
        </h2>

        <p className="text-white text-center mt-4">
          Login using Membership ID and Email / Phone
        </p>

        {/* LOGIN FORM */}
        <div className="mt-6 space-y-5 text-white">
          {/* Membership ID */}
          <input
            placeholder="Membership ID"
            value={membershipId}
            disabled
            className="
    w-full px-4 py-3 
    bg-white/30
    border border-white 
    rounded-full 
    text-white
    cursor-not-allowed
    placeholder-white
  "
          />

          {/* Email or Phone */}
          <input
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="
    w-full px-4 py-3 
    bg-transparent 
    border border-white 
    rounded-full 
    placeholder-white
    focus:ring-2 focus:ring-[#895C40] outline-none
  "
          />

          <p className="text-xs text-white/80 mt-1 text-center">
            ⚠️ Please enter your <b>registered Email ID or Phone Number</b>.
          </p>

          {/* Login Button */}
          <button
            disabled={loading}
            onClick={handleLogin}
            className="
              w-full py-3 
              bg-[#895C40] 
              hover:bg-white hover:text-[#895C40] 
              rounded-full 
              font-semibold 
              text-white
              transition
              disabled:opacity-60
            "
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
