import React from "react";
import Sidebar from "../../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-gray-300">Dashboard is still under construction 🚧</h1>
      </div>
    </div>
  );
};

export default Dashboard;
