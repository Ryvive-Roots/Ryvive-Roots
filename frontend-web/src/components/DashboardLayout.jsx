import React, { useState } from "react";
import { Menu, X, LogOut, Bell, UserCircle } from "lucide-react";
import Logo from "../assets/optimized/logo.png";

const DashboardLayout = ({ children }) => {
  const [active, setActive] = useState("profile");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  return (
    <div className="min-h-screen font-roboto bg-[#f6f7f3]">

      {/* 🔥 TOP NAVBAR */}
      <div className="fixed top-0 cursor-pointer left-0 right-0 bg-white shadow-md z-50 px-6 py-3 flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center">
                       <img 
                         src={Logo}
                         alt="Logo"
                         className="w-48 object-contain"
                       />
                     </a>
         
        
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          {/* NOTIFICATION */}
          <div className="relative cursor-pointer">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
              2
            </span>
          </div>

          {/* PROFILE */}
         <div
  onClick={() => {
    setActive("profile");
    setOpen(false); // close sidebar on mobile
  }}
  className="flex items-center gap-2 cursor-pointer"
>
  <UserCircle className="w-7 h-7 text-gray-700" />
  <span className="hidden md:block text-gray-700">Profile</span>
</div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex pt-16"> {/* padding for navbar */}

        {/* MOBILE HEADER */}
        <div className="md:hidden fixed top-22  left-0 right-0 bg-white z-40 flex items-center justify-between px-4 py-3 shadow">
          <h2 className="font-semibold">Dashboard</h2>
          <button onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* SIDEBAR */}
       <aside
  className={`fixed md:static top-10 left-0 
  h-screen w-64 bg-white z-40 
  border-r border-gray-200
  transform ${open ? "translate-x-0" : "-translate-x-full"} 
  md:translate-x-0 transition-transform duration-300
  px-6 py-6`}
>

          <nav className="space-y-3 mt-10 font-roboto">

            <button
              onClick={() => { setActive("profile"); setOpen(false); }}
              className={`w-full text-left px-4 py-2 rounded transition ${
                active === "profile"
                  ? "bg-[#3f6b2a] text-white"
                  : "hover:bg-[#3f6b2a]/80 hover:text-white"
              }`}
            >
              My Information
            </button>

            <button
              onClick={() => { setActive("subscription"); setOpen(false); }}
              className={`w-full text-left px-4 py-2 rounded transition ${
                active === "subscription"
                  ? "bg-[#3f6b2a] text-white"
                  : "hover:bg-[#3f6b2a]/80 hover:text-white"
              }`}
            >
              My Subscription
            </button>

            <button
              onClick={() => { setActive("schedule"); setOpen(false); }}
              className={`w-full text-left px-4 py-2 rounded transition ${
                active === "schedule"
                  ? "bg-[#3f6b2a] text-white"
                  : "hover:bg-[#3f6b2a]/80 hover:text-white"
              }`}
            >
              My Daily Schedule
            </button>

            <button
              onClick={() => { setActive("orders"); setOpen(false); }}
              className={`w-full text-left px-4 py-2 rounded transition ${
                active === "orders"
                  ? "bg-[#3f6b2a] text-white"
                  : "hover:bg-[#3f6b2a]/80 hover:text-white"
              }`}
            >
              Purchase History
            </button>

             <button
              onClick={() => { setActive("orders"); setOpen(false); }}
              className={`w-full text-left px-4 py-2 rounded transition ${
                active === "orders"
                  ? "bg-[#3f6b2a] text-white"
                  : "hover:bg-[#3f6b2a]/80 hover:text-white"
              }`}
            >
              Upgrade Plan
            </button>

             <button
              onClick={() => { setActive("orders"); setOpen(false); }}
              className={`w-full text-left px-4 py-2 rounded transition ${
                active === "orders"
                  ? "bg-[#3f6b2a] text-white"
                  : "hover:bg-[#3f6b2a]/80 hover:text-white"
              }`}
            >
              Support
            </button>

          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex justify-center px-4 mt-24 md:mt-6">
          <div className="w-full max-w-5xl">
            {React.Children.map(children, (child) =>
              React.cloneElement(child, { active })
            )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;