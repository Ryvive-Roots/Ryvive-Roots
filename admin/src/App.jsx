import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import RyviveAdminDashboard from "./pages/ryvive-admin-dashboard";
import RyviveAdminDashboard1 from "./pages/ryvive-admin-dashboard1";
import RyviveAdminDashboard0 from "./pages/ryvive-admin-dashboard0";
import RyviveAdminDashboard2 from "./pages/ryvive-admin-dashboard-enhanced";

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
