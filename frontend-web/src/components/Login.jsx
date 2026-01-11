import { useState } from "react";

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-96 space-y-4">
        <h2 className="text-xl font-semibold text-center">Login</h2>

        <input
          placeholder="Membership ID"
          value={membershipId}
          onChange={(e) => setMembershipId(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-3 rounded"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
};

export default Login;
