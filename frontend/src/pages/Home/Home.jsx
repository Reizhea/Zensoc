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

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Instagram,
//   Facebook,
//   Paperclip,
//   Send,
//   Search,
//   MoreHorizontal,
//   User,
//   Smile,
// } from "lucide-react";
// import Sidebar from "../../components/Sidebar";
// import { useNavigate } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebase";

// const socialIcons = [
//   { name: "Instagram", icon: Instagram, color: "text-pink-500" },
//   { name: "Facebook", icon: Facebook, color: "text-blue-500" },
// ];

// const HomePage = () => {
//   const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
//   const [hasToken, setHasToken] = useState(false);
//   const [activeContact, setActiveContact] = useState(null);
//   const [conversations, setConversations] = useState([]);
//   const [pageAccessToken, setPageAccessToken] = useState(null);
//   const [pageId, setPageId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchConversations = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const platform = selectedPlatform === "Facebook" ? "facebookTokens" : "instagramTokens";
//       const ref = doc(db, platform, user.uid);
//       const snap = await getDoc(ref);

//       const tokenExists = snap.exists() && !!snap.data().accessToken;
//       const pageToken = snap.data()?.pageaccessToken;
//       const page = snap.data()?.pageId;

//       setHasToken(tokenExists);
//       setPageAccessToken(pageToken);
//       setPageId(page);

//       if (
//         !tokenExists ||
//         selectedPlatform !== "Facebook" ||
//         !pageToken ||
//         !page
//       ) {
//         setConversations([]);
//         setActiveContact(null);
//         return;
//       }

//       try {
//         const res = await axios.get("http://localhost:5000/api/facebook/page-conversations", {
//           params: { token: pageToken, pageId: page },
//         });
//         setConversations(res.data);

//         if (!activeContact && res.data.length > 0) {
//           const convo = res.data[0];
//           const msgRes = await axios.get(
//             `http://localhost:5000/api/facebook/conversation/${convo.id}/messages`,
//             {
//               params: {
//                 name: convo.name,
//                 token: pageToken,
//               },
//             }
//           );
//           setActiveContact({ ...convo, messages: msgRes.data.messages });
//         }
//       } catch (err) {
//         console.error("❌ Failed to fetch conversations:", err);
//         setConversations([]);
//         setActiveContact(null);
//       }
//     };

//     const fetchMessages = async () => {
//       if (!activeContact?.id || !activeContact?.name || !pageAccessToken) return;

//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/facebook/conversation/${activeContact.id}/messages`,
//           {
//             params: {
//               name: activeContact.name,
//               token: pageAccessToken,
//             },
//           }
//         );
//         setActiveContact((prev) => ({ ...prev, messages: res.data.messages }));
//       } catch (err) {
//         console.error("❌ Failed to fetch messages:", err);
//       }
//     };

//     fetchConversations();
//     const interval = setInterval(() => {
//       fetchConversations();
//       fetchMessages();
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [selectedPlatform, activeContact?.id]);

//   const renderUserIcon = (user) => (
//     <div
//       className="w-10 h-10 rounded-full flex items-center justify-center"
//       style={{ backgroundColor: user.iconColor }}
//     >
//       <User className="w-5 h-5 text-white" />
//     </div>
//   );

//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       <Sidebar />

//       {/* Social Media Icons Sidebar */}
//       <div className="w-16 border-r border-gray-800 bg-gray-900 flex flex-col">
//         <div className="flex-1 flex flex-col items-center pt-6 space-y-6">
//           {socialIcons.map((item) => (
//             <div
//               key={item.name}
//               onClick={() => setSelectedPlatform(item.name)}
//               className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer 
//                 hover:bg-gray-700 transition-all ${
//                   selectedPlatform === item.name ? "bg-blue-600" : "bg-gray-800"
//                 }`}
//             >
//               <item.icon className={`w-5 h-5 ${item.color}`} />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Middle Column - Conversation List */}
//       <div className="w-72 border-r border-gray-800 bg-gray-900 flex flex-col">
//         <div className="p-4 border-b border-gray-800">
//           <h1 className="text-2xl font-bold">{selectedPlatform} Inbox</h1>
//         </div>

//         <div className="p-4">
//           <div className="bg-gray-800 rounded-md flex items-center p-2">
//             <Search className="w-5 h-5 text-gray-400 mr-2" />
//             <input
//               type="text"
//               placeholder="Search"
//               className="bg-transparent border-none outline-none w-full text-gray-300"
//             />
//           </div>
//         </div>

//         {/* Conversation List */}
//         <div className="overflow-y-auto flex-1 scrollbar-hide">
//           {hasToken &&
//             conversations.map((conversation) => (
//               <div
//                 key={conversation.id}
//                 className={`p-4 border-b border-gray-800 flex items-center cursor-pointer hover:bg-gray-800 transition-all duration-200 ${
//                   activeContact?.id === conversation.id ? "bg-gray-800" : ""
//                 }`}
//                 onClick={async () => {
//                   try {
//                     const res = await axios.get(
//                       `http://localhost:5000/api/facebook/conversation/${conversation.id}/messages`,
//                       {
//                         params: {
//                           name: conversation.name,
//                           token: pageAccessToken,
//                         },
//                       }
//                     );
//                     setActiveContact({
//                       ...conversation,
//                       messages: res.data.messages,
//                     });
//                   } catch (err) {
//                     console.error("Failed to fetch messages:", err);
//                   }
//                 }}
//               >
//                 <div className="relative">
//                   {renderUserIcon(conversation)}
//                   {conversation.hasUnread && (
//                     <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full" />
//                   )}
//                 </div>
//                 <div className="ml-3 flex-1">
//                   <div className="flex justify-between items-center">
//                     <h3 className="font-medium">{conversation.name}</h3>
//                     <span className="text-xs text-gray-400">{conversation.displayTime}</span>
//                   </div>
//                   <p className="text-sm text-gray-400 truncate">
//                     {conversation.lastMessage}
//                   </p>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>

//       {/* Right Side - Chat View */}
//       <div className="flex-1 flex flex-col bg-gray-900">
//         <div className="p-4 border-b border-gray-800 flex justify-between items-center">
//           {activeContact ? (
//             <>
//               <div className="flex items-center">
//                 {renderUserIcon(activeContact)}
//                 <h2 className="ml-3 font-medium">{activeContact.name}</h2>
//               </div>
//               <MoreHorizontal className="w-5 h-5 text-gray-400" />
//             </>
//           ) : (
//             <div />
//           )}
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
//           {!hasToken ? (
//             <div className="text-center mt-20">
//               <p className="text-gray-300 mb-4">
//                 Please connect your {selectedPlatform} account first.
//               </p>
//               <button
//                 className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded-md"
//                 onClick={() => navigate("/settings", { state: { tab: "connections" } })}
//               >
//                 Go to Settings
//               </button>
//             </div>
//           ) : selectedPlatform === "Facebook" && !pageAccessToken ? (
//             <div className="text-center mt-20">
//               <p className="text-gray-300 mb-4">
//                 Facebook Connected, but no page selected. Please select a page to display.
//               </p>
//               <button
//                 className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded-md"
//                 onClick={() => navigate("/settings", { state: { tab: "connections" } })}
//               >
//                 Go to Settings
//               </button>
//             </div>
//           ) : (
//             activeContact?.messages?.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`max-w-md ${
//                   msg.sender === "me"
//                     ? "ml-auto bg-gradient-to-r from-blue-600 to-blue-400 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
//                     : "bg-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
//                 } p-4 rounded-2xl whitespace-pre-wrap break-words`}
//               >
//                 <p>{msg.text}</p>
//                 <p className="text-xs text-gray-400 mt-2">{msg.time}</p>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="p-4 border-t border-gray-800">
//           <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
//             <Smile className="w-6 h-6 text-blue-500 mr-2" />
//             <input
//               type="text"
//               placeholder="Type a reply..."
//               className="flex-1 bg-transparent border-none outline-none"
//             />
//             <div className="flex items-center">
//               <Paperclip className="w-5 h-5 text-blue-500 ml-2" />
//               <Send className="w-5 h-5 text-blue-500 ml-2" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const style = document.createElement("style");
// style.textContent = `
//   .scrollbar-hide::-webkit-scrollbar {
//     display: none;
//   }
//   .scrollbar-hide {
//     -ms-overflow-style: none;
//     scrollbar-width: none;
//   }
// `;
// document.head.appendChild(style);

// export default HomePage;
