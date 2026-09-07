import { NavLink, useNavigate } from "react-router-dom";

import {
  HeartPulse,
  LayoutDashboard,
  ClipboardPlus,
  History,
  ChartNoAxesCombined,
  User,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "New Assessment",
      path: "/assessment",
      icon: ClipboardPlus,
    },
    {
      name: "History",
      path: "/history",
      icon: History,
    },
    {
      name: "Trends",
      path: "/trends",
      icon: ChartNoAxesCombined,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  const handleExit = () => {
    localStorage.removeItem("stress_user");
    localStorage.removeItem("latest_result");

    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 p-5 flex flex-col shrink-0">
      <div className="flex items-center gap-2 mb-10">
        <HeartPulse className="text-pink-500 w-7 h-7" />

        <span className="text-lg font-bold text-slate-900">
          Stress Monitor
        </span>
      </div>

      <nav className="space-y-2 flex-1">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-pink-50 text-pink-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={20} />

              {link.name}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleExit}
        className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition"
      >
        <LogOut size={20} />
        Exit
      </button>
    </aside>
  );
}

export default Sidebar;