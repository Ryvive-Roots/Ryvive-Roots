import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import RyviveAdminDashboard from "./pages/ryvive-admin-dashboard";
import RyviveAdminDashboard1 from "./pages/ryvive-admin-dashboard1";
import RyviveAdminDashboard0 from "./pages/ryvive-admin-dashboard0";
import RyviveAdminDashboard2 from "./pages/ryvive-admin-dashboard-enhanced";
import CompleteCreateAccount from "./pages/CompleteCreateAccount";
import AdminD from "./pages/AdminD";
import RyviveCompleteAdminDashboard from "./pages/RyviveCompleteAdminDashboard";


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
          element={token ? <AdminD  /> : <Navigate to="/" />}
        />
          <Route
          path="/adminD"
          element={<RyviveAdminDashboard2 />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
