import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const token = localStorage.getItem("adminToken");

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Default Route */}
        <Route
          path="/"
          element={token ? <Navigate to="/admin-dashboard" /> : <AdminLogin />}
        />

        {/* 🛡 Protected Dashboard */}
        <Route
          path="/admin-dashboard"
          element={token ? <AdminDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
