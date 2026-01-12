import { useState } from "react";
import Bg from "../assets/BgSignIn.jpeg";

const Login = () => {
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ membershipId, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } else {
      alert("Invalid login details");
    }
  };

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

        <p className="text-white text-center mt-4">Sign in to continue</p>

        {/* LOGIN FORM */}
        <div className="mt-6 space-y-5 text-white">
          <input
            placeholder="Membership ID"
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
            className="
              w-full px-4 py-3 
              bg-transparent 
              border border-white 
              rounded-full 
              placeholder-white
              focus:ring-2 focus:ring-[#895C40] outline-none
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full px-4 py-3 
              bg-transparent 
              border border-white 
              rounded-full 
              placeholder-white
              focus:ring-2 focus:ring-[#895C40] outline-none
            "
          />

          <button
            onClick={handleLogin}
            className="
              w-full py-3 
              bg-[#895C40] 
              hover:bg-white hover:text-[#895C40] 
              rounded-full 
              font-semibold 
              text-white
              transition
            "
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
