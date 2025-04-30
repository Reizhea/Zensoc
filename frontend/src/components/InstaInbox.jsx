import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MoreHorizontal, Paperclip, Send, Smile, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const InstagramInbox = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true); // loader
  const [hasToken, setHasToken] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [pageAccessToken, setPageAccessToken] = useState(null);
  const [pageId, setPageId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const messageEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isManuallySwitching = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const user = auth.currentUser;
      if (!user) return setLoading(false);

      const ref = doc(db, "metaTokens", user.uid);
      const snap = await getDoc(ref);

      const tokenExists = snap.exists() && !!snap.data().fbToken && !!snap.data().instaToken;
      const pageToken = snap.data()?.pageToken;
      const page = snap.data()?.pageId;
      const instaUser = snap.data()?.instaToken;

      setHasToken(tokenExists);
      setPageAccessToken(pageToken);
      setPageId(page);
      setUserId(instaUser);

      if (!tokenExists || !pageToken || !page || !instaUser) {
        setConversations([]);
        setActiveContact(null);
        return setLoading(false);
      }

      try {
        const res = await axios.get(`${BACKEND_URL}/api/instagram/conversations`, {
          params: { token: pageToken, pageId: page, userId: instaUser },
        });
        setConversations(res.data);

        if (!activeContact && res.data.length > 0) {
          const convo = res.data[0];
          const msgRes = await axios.get(
            `${BACKEND_URL}/api/instagram/conversation/${convo.id}/messages`,
            { params: { name: convo.name, token: pageToken, pageId: page, userId: instaUser } }
          );
          const messages = msgRes.data.messages;
          const userMsg = messages.find((m) => m.sender === "them");

          setActiveContact({
            ...convo,
            messages,
            userId: userMsg?.userId,
          });
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      } catch (err) {
        console.error("Failed to fetch IG conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMessages = async () => {
      if (!activeContact?.id || !pageAccessToken || !pageId || !userId) return;
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/instagram/conversation/${activeContact.id}/messages`,
          { params: { name: activeContact.name, token: pageAccessToken, pageId, userId } }
        );
        const messages = res.data.messages;
        const userMsg = messages.find((m) => m.sender === "them");
        setActiveContact((prev) => ({
          ...prev,
          messages,
          userId: userMsg?.userId,
        }));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchConversations();
    const interval = setInterval(() => {
      if (isManuallySwitching.current) return;
      fetchConversations();
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeContact?.id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeContact?.messages]);

  const renderUserIcon = (user) => (
    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: user.iconColor }}>
      <User className="w-5 h-5 text-white" />
    </div>
  );

  const handleSendMessage = async () => {
    if (!input.trim() || !pageAccessToken || !activeContact?.userId) return;

    const messageToSend = input;
    setInput("");

    const optimisticId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: optimisticId,
      text: messageToSend,
      sender: "me",
      userId: userId,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      optimistic: true,
    };

    setActiveContact((prev) => ({
      ...prev,
      messages: [...(prev?.messages || []), optimisticMsg],
    }));

    try {
      await axios.post(`${BACKEND_URL}/api/instagram/send-message`, {
        pageAccessToken,
        recipientId: activeContact.userId,
        message: messageToSend,
      });

      const res = await axios.get(
        `${BACKEND_URL}/api/instagram/conversation/${activeContact.id}/messages`,
        {
          params: {
            name: activeContact.name,
            token: pageAccessToken,
            pageId,
            userId,
          },
        }
      );

      const messages = res.data.messages;

      const newMsgInResponse = messages.some((m) => m.text === messageToSend);
      if (newMsgInResponse) {
        const userMsg = messages.find((m) => m.sender === "them");
      
        const isSame =
          activeContact.messages.length === messages.length &&
          activeContact.messages.every((msg, i) => {
            const incoming = messages[i];
            return msg.text === incoming.text && msg.sender === incoming.sender;
          });
      
        if (!isSame) {
          setActiveContact((prev) => ({
            ...prev,
            messages,
            userId: userMsg?.userId,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to send IG message:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!hasToken) {
    return (
      <div className="text-center mt-20 w-full">
        <p className="text-gray-300 mb-4">Please connect your Instagram account first.</p>
        <button
          className="bg-pink-500 hover:bg-pink-600 px-4 py-2 text-sm rounded-md"
          onClick={() => navigate("/settings", { state: { tab: "connections" } })}
        >
          Go to Settings
        </button>
      </div>
    );
  }

  if (!pageAccessToken) {
    return (
      <div className="text-center mt-20 w-full">
        <p className="text-gray-300 mb-4">
          Instagram Connected, but no page selected. Please select a page to display.
        </p>
        <button
          className="bg-pink-500 hover:bg-pink-600 px-4 py-2 text-sm rounded-md"
          onClick={() => navigate("/settings", { state: { tab: "connections" } })}
        >
          Go to Settings
        </button>
      </div>
    );
  }

  const recipientName =
    activeContact?.messages?.find((msg) => msg.sender === "them")?.senderName || activeContact?.name;

  return (
    <>
      {/* Sidebar */}
      <div className="w-72 border-r border-gray-800 bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Instagram Inbox</h1>
        </div>
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
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-gray-800 flex items-center cursor-pointer hover:bg-gray-800 transition-all duration-200 ${
                activeContact?.id === conversation.id ? "bg-gray-800" : ""
              }`}
              onClick={async () => {
                isManuallySwitching.current = true;
                try {
                  const res = await axios.get(
                    `${BACKEND_URL}/api/instagram/conversation/${conversation.id}/messages`,
                    {
                      params: {
                        name: conversation.name,
                        token: pageAccessToken,
                        pageId,
                        userId,
                      },
                    }
                  );
                  const messages = res.data.messages;
                  const userMsg = messages.find((m) => m.sender === "them");

                  setActiveContact({
                    ...conversation,
                    messages,
                    userId: userMsg?.userId,
                  });
                  setInput("");
                } catch (err) {
                  console.error("Failed to fetch IG messages:", err);
                } finally {
                  setTimeout(() => {
                    isManuallySwitching.current = false;
                  }, 1000);
                }
              }}
            >
              <div className="relative">
                {renderUserIcon(conversation)}
                {conversation.unreadCount > 0 && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{conversation.name}</h3>
                  <span className="text-xs text-gray-400">{conversation.displayTime}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {conversation.lastMessage?.length > 25
                    ? `${conversation.lastMessage.slice(0, 25)}...`
                    : conversation.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          {activeContact && (
            <>
              <div className="flex items-center">
                {renderUserIcon(activeContact)}
                <h2 className="ml-3 font-medium">{recipientName}</h2>
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </>
          )}
        </div>

        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {activeContact?.messages?.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-md ${
                msg.userId === userId
                  ? "ml-auto bg-gradient-to-r from-blue-600 to-blue-400 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                  : "bg-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
              } p-4 rounded-2xl whitespace-pre-wrap break-words ${msg.optimistic ? "fade-in" : ""}`}
            >
              <p>{msg.text}</p>
              <p className="text-xs text-gray-400 mt-2">{msg.time}</p>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
            <Smile className="w-6 h-6 text-blue-500 mr-2" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a reply..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-transparent border-none outline-none"
            />
            <div className="flex items-center cursor-pointer" onClick={handleSendMessage}>
              <Paperclip className="w-5 h-5 text-blue-500 ml-2" />
              <Send className="w-5 h-5 text-blue-500 ml-2" />
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default InstagramInbox;
