import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import FacebookConnect from "../../components/FacebookConnect";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-60">
        <Sidebar alwaysExpanded />
      </div>

      <div className="flex-1 px-20 py-12 overflow-y-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold self-start">Settings</h1>

        {/* Reset settings button */}
        <div className="w-full max-w-3xl flex justify-end mb-5">
          <button className="border border-gray-600 px-4 py-2 rounded-md text-gray-400 hover:text-white hover:border-white">
            Reset settings
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-start space-x-2">
          {["General", "Connections", "Profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`w-75 px-20 py-3 rounded-t-3xl font-semibold transition-colors duration-200 ${
                activeTab === tab.toLowerCase()
                  ? "bg-gray-800 text-white"
                  : "bg-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-5xl relative">
          {activeTab === "general" && (
            <>
              {/* Brand input */}
              <div className="mb-70">
                <label className="block text-sm text-gray-400 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  defaultValue="ZenSoc"
                  className="w-[80%] bg-gray-900 text-white border border-gray-700 px-4 py-2 h-[42px] rounded-md outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-md font-medium h-[42px] text-sm mt-4 ml-4">
                Save Changes
              </button>
              </div>

              {/* Help Centered */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-blue-400 cursor-pointer">
                🔵 Help
              </div>
            </>
          )}

            {activeTab === "connections" && (
              <div className="flex space-x-6 items-start">
                <FacebookConnect />
              </div>
            )}

          {activeTab === "profile" && (
            <p className="text-sm text-gray-400">Coming soon...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
