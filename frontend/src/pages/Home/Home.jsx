import React, { useState } from "react";
import {
  MessageCircle,
  Instagram,
  Facebook,
  Activity,
  PlusCircle,
  Settings,
  Twitter,
  Linkedin,
  Paperclip,
  Send,
  Search,
  MoreHorizontal,
  Phone,
  Video,
  Home,
  BarChart2,
  Mic,
  Calendar,
  Crown,
  User,
  Smile,
} from "lucide-react";
import { Avatar } from "@mui/material";

// Dummy data for conversations
const conversations = [
  {
    id: 1,
    name: "Brad",
    icon: "user",
    iconColor: "#4299e1",
    lastMessage: "Did you see the latest update?",
    time: "2min",
    hasUnread: true,
    unreadCount: 2,
  },
  {
    id: 2,
    name: "Sara",
    icon: "user",
    iconColor: "#48bb78",
    lastMessage: "Let's meet for coffee tomorrow",
    time: "2min",
    hasUnread: true,
    unreadCount: 1,
  },
  {
    id: 3,
    name: "Melissa",
    icon: "user",
    iconColor: "#ed8936",
    lastMessage: "Can you send me the files",
    time: "2min",
    hasUnread: false,
  },
  {
    id: 4,
    name: "Chris",
    icon: "user",
    iconColor: "#9f7aea",
    lastMessage: "Okay man!",
    time: "2min",
    hasUnread: false,
  },
  {
    id: 5,
    name: "Tamara",
    icon: "user",
    iconColor: "#f56565",
    lastMessage: "Done deal",
    time: "2min",
    hasUnread: false,
  },
  {
    id: 6,
    name: "Daniel",
    icon: "user",
    iconColor: "#38b2ac",
    lastMessage: "Can't wait for tomorrow",
    time: "2min",
    hasUnread: false,
  },
  {
    id: 7,
    name: "Tamara",
    icon: "user",
    iconColor: "#f56565",
    lastMessage: "Alright!",
    time: "2min",
    hasUnread: false,
  },
];

// Dummy data for active conversation
const activeConversation = {
  id: 2,
  name: "Sara",
  icon: "user",
  iconColor: "#48bb78",
  messages: [
    {
      id: 1,
      text: "I was wondering if you could help me with the project tomorrow? I need some assistance with the design elements.",
      time: "2 min ago",
      sender: "them",
    },
    {
      id: 2,
      text: "Sure, I'm free in the afternoon. We can work on finalizing the homepage design.",
      time: "2 min ago",
      sender: "me",
    },
  ],
  files: [
    {
      id: "001",
      name: "Doc 001",
      type: "ZIP FILE",
      size: "56.5MB",
    },
  ],
};

// Navigation menu items
const navItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Inbox", icon: MessageCircle, path: "/inbox", active: true },
  { name: "Analytics", icon: BarChart2, path: "/analytics" },
  { name: "Listener", icon: Mic, path: "/listener" },
  { name: "Scheduler", icon: Calendar, path: "/scheduler" },
];

// Social media icons
const socialIcons = [
  { name: "Instagram", icon: Instagram, color: "text-pink-500" },
  { name: "Facebook", icon: Facebook, color: "text-blue-500" },
  { name: "Twitter", icon: Twitter, color: "text-blue-400" },
  { name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
];

const HomePage = () => {
  const [hoveredSidebar, setHoveredSidebar] = useState(false);
  const [activeContact, setActiveContact] = useState(activeConversation);

  // Helper function to render icons for users
  const renderUserIcon = (user) => {
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: user.iconColor }}
      >
        <User className="w-5 h-5 text-white" />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Sidebar - Collapsible */}
      <div
        className="relative transition-all duration-300 ease-in-out"
        onMouseEnter={() => setHoveredSidebar(true)}
        onMouseLeave={() => setHoveredSidebar(false)}
      >
        <div
          className={`bg-gray-900 h-full border-r border-gray-800 transition-all duration-300 ease-in-out ${
            hoveredSidebar ? "w-64" : "w-16"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* App Header/Logo Area */}
            <div className="p-4 border-b border-gray-800">
              {hoveredSidebar && (
                <div className="text-gray-400 text-sm">STORE</div>
              )}
            </div>

            {/* Navigation Items */}
            <div className="flex-1">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  className={`flex items-center p-4 cursor-pointer transition-all duration-200 ${
                    item.active
                      ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white"
                      : "text-blue-500 hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {hoveredSidebar && (
                    <span className="ml-3 transition-opacity duration-200">
                      {item.name}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Icons */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex flex-col space-y-6">
                <Crown className="ml-1 w-5 h-5 text-blue-500" />
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Icons Sidebar */}
      <div className="w-16 border-r border-gray-800 bg-gray-900 flex flex-col">
        <div className="flex-1 flex flex-col items-center pt-6 space-y-6">
          {socialIcons.map((item) => (
            <div
              key={item.name}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-all"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Middle Section - Conversation List */}
      <div className="w-72 border-r border-gray-800 bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Inbox</h1>
        </div>

        {/* Search Box */}
        <div className="p-4">
          <div className="bg-gray-800 rounded-md flex items-center p-2">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none outline-none w-full text-gray-300"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-gray-800 flex items-center cursor-pointer hover:bg-gray-800 transition-all duration-200 ${
                activeContact.id === conversation.id ? "bg-gray-800" : ""
              }`}
              onClick={() => setActiveContact(activeConversation)}
            >
              <div className="relative">
                {renderUserIcon(conversation)}
                {conversation.hasUnread && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{conversation.name}</h3>
                  <span className="text-xs text-gray-400">
                    {conversation.time}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Active Conversation */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Conversation Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center">
            {renderUserIcon(activeContact)}
            <h2 className="ml-3 font-medium">{activeContact.name}</h2>
          </div>
          <div>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Conversation Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {activeContact.messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-md ${
                message.sender === "me"
                  ? "ml-auto bg-gradient-to-r from-blue-600 to-blue-400 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                  : "bg-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
              } p-4 rounded-2xl`}
            >
              <p>{message.text}</p>
              <p className="text-xs text-gray-400 mt-2">{message.time}</p>
            </div>
          ))}

          {/* File attachment display */}
          {activeContact.files && activeContact.files.length > 0 && (
            <div className="max-w-md ml-auto bg-gradient-to-r from-blue-600 to-blue-400 p-4 rounded-2xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{activeContact.files[0].name}</p>
                  <p className="text-xs">
                    {activeContact.files[0].type} —{" "}
                    {activeContact.files[0].size}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
            <div className="flex items-center">
              <button className="text-blue-500 mr-2">
                <Smile className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Type a reply..."
              className="flex-1 bg-transparent border-none outline-none"
            />
            <div className="flex items-center">
              <button className="text-blue-500 ml-2">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="text-blue-500 ml-2">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this CSS to hide scrollbars while maintaining functionality
const style = document.createElement("style");
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default HomePage;
