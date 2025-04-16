import React, { useState } from "react";
import { Instagram, Facebook } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import FacebookInbox from "../../components/FacebookInbox";
import InstagramInbox from "../../components/InstaInbox";

const socialIcons = [
  { name: "Instagram", icon: Instagram, color: "text-pink-500" },
  { name: "Facebook", icon: Facebook, color: "text-blue-500" },
];

const HomePage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="w-16 border-r border-gray-800 bg-gray-900 flex flex-col">
        <div className="flex-1 flex flex-col items-center pt-6 space-y-6">
          {socialIcons.map((item) => (
            <div
              key={item.name}
              onClick={() => setSelectedPlatform(item.name)}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer 
                hover:bg-gray-700 transition-all ${
                  selectedPlatform === item.name ? "bg-blue-600" : "bg-gray-800"
                }`}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
          ))}
        </div>
      </div>

      {selectedPlatform === "Facebook" ? <FacebookInbox /> : <InstagramInbox />}
    </div>
  );
};

export default HomePage;