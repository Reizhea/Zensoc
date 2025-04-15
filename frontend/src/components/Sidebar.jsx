import React, { useState } from "react";
import {
  Home,
  MessageCircle,
  BarChart2,
  Mic,
  Calendar,
  Crown,
  User,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Inbox", icon: MessageCircle, path: "/home" },
  { name: "Analytics", icon: BarChart2, path: "/analytics" },
  { name: "Listener", icon: Mic, path: "/listener" },
  { name: "Scheduler", icon: Calendar, path: "/scheduler" },
];

const Sidebar = ({ alwaysExpanded = false }) => {
  const [hovered, setHovered] = useState(false);
  const expanded = alwaysExpanded || hovered;
  const location = useLocation();
  const isSettingsPage = location.pathname === "/settings";

  const renderItem = ({ name, icon: Icon, path }) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        key={path}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-150 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white"
            : "text-blue-500 hover:bg-gray-800"
        }`}
      >
        <Icon className="w-5 h-5" />
        {expanded && <span className="text-sm whitespace-nowrap">{name}</span>}
      </Link>
    );
  };

  return (
    <div
      className="relative transition-all duration-150 ease-in-out"
      onMouseEnter={() => !alwaysExpanded && setHovered(true)}
      onMouseLeave={() => !alwaysExpanded && setHovered(false)}
    >
      <div
        className={`bg-gray-900 h-full border-r border-gray-800 flex flex-col justify-between transition-all duration-150 ease-in-out ${
          expanded ? "w-64" : "w-14"
        }`}
      >
        {/* Top */}
        <div className={isSettingsPage && expanded ? "mb-66.5" : ""}>
          <div className="flex items-center justify-center h-20 border-b border-gray-800">
            <img
              src="/src/assets/ZenSocLogo.svg"
              alt="ZenSoc"
              className={`transition-all duration-300 ${expanded ? "w-28" : "w-8"}`}
            />
          </div>
          <div className="py-4 flex flex-col gap-1">
            {navItems.map(renderItem)}
          </div>
        </div>

        {/* Bottom */}
        <div className="py-4 flex flex-col gap-1">
          {renderItem({ name: "Get Premium", icon: Crown, path: "#" })}
          {renderItem({ name: "Settings", icon: Settings, path: "/settings" })}

          {/* User */}
          <div className="flex items-center gap-3 px-2.5 py-2 rounded-md text-blue-500 hover:bg-gray-800 transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-300" />
            </div>
            {expanded && <span>User</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
