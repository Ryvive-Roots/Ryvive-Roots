import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        window.location.href = "/admin-dashboard";
      } else {
        alert(data.message || "Invalid login");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Admin Login</h2>

        <input
          placeholder="Email"
          className="border p-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
        >
          Login
        </button>
      </div>
    </div>
  );
}
