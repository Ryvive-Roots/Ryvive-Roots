import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [active, setActive] = useState("profile");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  return (
    <div className="min-h-screen font-roboto flex bg-[#f6f7f3] relative">

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#2c511f] text-white z-50 flex items-center justify-between px-4 py-3">
        <h2 className="font-semibold">Dashboard</h2>
        <button onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-[#2c511f] text-white z-40
        transform ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300
        px-6 py-10`}
      >
        <h2 className="text-xl font-cinzel font-semibold mb-10 hidden md:block">
          Dashboard
        </h2>

       <nav className="space-y-3 font-roboto">

  {/* MY PROFILE */}
  <button
    onClick={() => {
      setActive("profile");
      setOpen(false);
    }}
    className={`w-full text-left px-4 py-2 rounded transition
      ${
        active === "profile"
          ? "bg-[#3f6b2a]"
          : "hover:bg-[#3f6b2a]/80"
      }`}
  >
    My Profile
  </button>

  {/* MY SUBSCRIPTION */}
  <button
    onClick={() => {
      setActive("subscription");
      setOpen(false);
    }}
    className={`w-full text-left px-4 py-2 rounded transition
      ${
        active === "subscription"
          ? "bg-[#3f6b2a]"
          : "hover:bg-[#3f6b2a]/80"
      }`}
  >
    My Subscription
  </button>
  {/* MY SCHEDULE */}
<button
  onClick={() => {
    setActive("schedule");
    setOpen(false);
  }}
  className={`w-full text-left px-4 py-2 rounded transition
    ${
      active === "schedule"
        ? "bg-[#3f6b2a]"
        : "hover:bg-[#3f6b2a]/80"
    }`}
>
  My Schedule
</button>

{/* ORDER HISTORY */}
<button
  onClick={() => {
    setActive("orders");
    setOpen(false);
  }}
  className={`w-full text-left px-4 py-2 rounded transition
    ${
      active === "orders"
        ? "bg-[#3f6b2a]"
        : "hover:bg-[#3f6b2a]/80"
    }`}
>
  Order History
</button>

  {/* LOGOUT */}
  <button
    onClick={handleLogout}
    className="w-full text-left px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2 mt-6"
  >
    <LogOut size={16} /> Logout
  </button>

</nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex justify-center mt-20 md:mt-0 px-4">
        <div className="w-full max-w-5xl">

          {/* 🔥 SHOW ONLY ACTIVE SECTION */}
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { active })
          )}

        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 