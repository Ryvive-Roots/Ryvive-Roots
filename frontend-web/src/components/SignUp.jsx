import { useState } from "react";
import Bg from "../assets/BgSignIn.jpeg";

export default function SignupForm() {
  const [isSignIn, setIsSignIn] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "", 
    
    allergy: "",
    location: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignIn ? "Sign In" : "Sign Up", formData);
  };

  return (
    <div className="relative mt-28 font-merriweather min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10">

      {/* 🔹 BACKGROUND IMAGE BLURRED */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${Bg})`,
          filter: "blur(6px)",
        }}
      ></div>

      {/* 🔹 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* 🔹 RESPONSIVE FORM CARD */}
      <div
        className="
          relative 
          w-full 
          max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl
          bg-white/20 
          rounded-2xl 
          p-5 sm:p-7 md:p-20 
          shadow-2xl
        "
      >
        {/* ---------- TITLE ---------- */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
          {isSignIn ? "Welcome Back!" : "Create Your Account"}
        </h1>

        <p className="text-white text-center mt-5 text-sm sm:text-base md:text-lg">
          {isSignIn
            ? "Sign in to continue."
            : "Join us and explore the best services."}
        </p>

        {/* ---------- Toggle Text ---------- */}
        <p className="text-center text-white mt-5 text-sm sm:text-base">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-white font-bold ml-1 cursor-pointer hover:underline"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </button>
        </p>

        {/* ====================================================== */}
        {/*                     SIGN IN FORM                      */}
        {/* ====================================================== */}
        {isSignIn ? (
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4 cursor-pointer sm:space-y-5 md:space-y-6 text-white"
          >
            <input
              type="text"
              name="email"
              placeholder="Email ID or Phone"
              value={formData.email}
              onChange={handleChange}
              className="
                w-full px-4 py-3 
                bg-transparent 
                border border-white 
                rounded-full 
                placeholder-white
                focus:ring-2 focus:ring-[#895C40] outline-none
                text-sm sm:text-base
              "
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="
                w-full px-4 py-3 
                bg-transparent 
                border border-white 
                rounded-full 
                placeholder-white
                focus:ring-2 focus:ring-[#895C40] outline-none
                text-sm sm:text-base
              "
            />

            <div className="text-right">
              <button
                type="button"
                className="text-blue-300 text-sm sm:text-base hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="
                w-full py-3 
                bg-[#895C40] hover:bg-white hover:text-[#895C40] rounded-full font-semibold text-white
                text-base sm:text-lg 
                transition
              "
            >
              Sign In
            </button>
          </form>
        ) : (
          /* ====================================================== */
          /*                     SIGN UP FORM                      */
          /* ====================================================== */
<form
  onSubmit={handleSubmit}
  className="
    mt-6 
    grid 
    grid-cols-1          /* Mobile = 1 column */
    md:grid-cols-2       /* Desktop = 2 columns */
    gap-4 sm:gap-5 md:gap-6 
    text-white"
>
  <input
    type="text"
    name="name"
    placeholder="Full Name"
    value={formData.name}
    onChange={handleChange}
    className="w-full px-4 py-3 bg-transparent border border-white rounded-full placeholder-white focus:ring-2 focus:ring-[#895C40] outline-none"
  />

  <input
    type="email"
    name="email"
    placeholder="Email ID"
    value={formData.email}
    onChange={handleChange}
    className="w-full px-4 py-3 bg-transparent border border-white rounded-full placeholder-white focus:ring-2 focus:ring-[#895C40] outline-none"
  />

<input
  type="tel"                        // ← change type to tel
  name="phone"
  placeholder="Phone Number"
  value={formData.phone}
  onChange={handleChange}
  className="w-full px-4 py-3 bg-transparent border border-white rounded-full placeholder-white focus:ring-2 focus:ring-[#895C40] outline-none"
/>


  

  <input
    type="password"
    name="password"
    placeholder="Create Password"
    value={formData.password}
    onChange={handleChange}
    className="w-full px-4 py-3 bg-transparent border border-white rounded-full placeholder-white focus:ring-2 focus:ring-[#895C40] outline-none"
  />

  {/* Submit button full width across both columns */}
  <div className="md:col-span-2">
    <button
      type="submit"
      className="w-full mt-2 py-3 bg-[#895C40] hover:bg-white hover:text-[#895C40] rounded-full font-semibold text-white text-base sm:text-lg transition"
    >
      Create Account
    </button>
  </div>
</form>

        )}
      </div>
    </div>
  );
}
