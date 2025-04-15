const axios = require("axios");

const exchangeToken = async (req, res) => {
  const shortLivedToken = req.body.accessToken;

  if (!shortLivedToken)
    return res.status(400).json({ error: "Access token is required" });

  try {
    const response = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: process.env.FB_APP_ID,
          client_secret: process.env.FB_APP_SECRET,
          fb_exchange_token: shortLivedToken,
        },
      }
    );

    const longLivedToken = response.data.access_token;
    return res.status(200).json({ longLivedToken });
  } catch (err) {
    console.error("Error exchanging token:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to exchange token" });
  }
};

const getPages = async (req, res) => {
  const userToken = req.body.accessToken;
  if (!userToken) return res.status(400).json({ error: "Access token is required" });

  try {
    const { data } = await axios.get(`https://graph.facebook.com/v19.0/me/accounts`, {
      params: { access_token: userToken }
    });

    if (!data.data.length) return res.status(400).json({ error: "No pages found" });

    const pages = data.data.map(page => ({
      pageId: page.id,
      name: page.name,
      accessToken: page.access_token,
    }));
    
    return res.status(200).json({ pages });
  } catch (err) {
    console.error("Error fetching pages:", err.message);
    res.status(500).json({ error: "Failed to fetch pages" });
  }
};

const getPageConversations = async (req, res) => {
  const pageAccessToken = req.query.token;
  const pageId = req.query.pageId;

  try {
    const convoRes = await axios.get(
      `https://graph.facebook.com/v19.0/${pageId}/conversations`,
      {
        params: {
          access_token: pageAccessToken,
          fields: "id,updated_time,unread_count",
          limit: 10,
        },
      }
    );

    const conversations = convoRes.data.data;
    const result = [];

    for (const convo of conversations) {
      const messagesRes = await axios.get(
        `https://graph.facebook.com/v19.0/${convo.id}/messages`,
        {
          params: {
            access_token: pageAccessToken,
            fields: "message,from,created_time,id",
            limit: 10,
          },
        }
      );

      const allMessages = messagesRes.data.data || [];
      if (!allMessages.length) continue;

      const latest = allMessages[0];
      const lastUserMsg = allMessages.find((msg) => msg.from?.id !== pageId);
      if (!latest || !latest.message) continue;

      const createdAt = new Date(latest.created_time);
      const now = new Date();
      const isToday =
        createdAt.getDate() === now.getDate() &&
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear();

      const displayTime = isToday
        ? createdAt.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

      result.push({
        id: convo.id,
        name: lastUserMsg?.from?.name || "Unknown",
        lastMessage: latest.message,
        displayTime,
        hasUnread: convo.unread_count > 0,
        unreadCount: convo.unread_count || 0,
        icon: "user",
        iconColor: "#4299e1",
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching conversation list:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

const getMessagesForConversation = async (req, res) => {
  const pageAccessToken = req.query.token;
  const userName = req.query.name || "Unknown";
  const threadId = req.params.id;
  const pageId = req.query.pageId;

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${threadId}/messages`,
      {
        params: {
          access_token: pageAccessToken,
          fields: "message,from,created_time,id",
          limit: 50,
        },
      }
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const messages = response.data.data
      .filter((msg) => msg.message && msg.message.trim() !== "")
      .map((msg) => {
        const msgDate = new Date(msg.created_time);
        const isToday = msgDate >= today;

        return {
          id: msg.id,
          text: msg.message,
          sender: msg.from?.id === pageId ? "me" : "them",
          senderName: msg.from?.name || "Unknown",
          userId: msg.from?.id,
          time: isToday
            ? msgDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            : msgDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
        };
      })
      .reverse();

    const lastUserMsg = messages.find((msg) => msg.sender === "them");

    res.status(200).json({
      id: threadId,
      name: lastUserMsg?.senderName || userName,
      icon: "user",
      iconColor: "#4299e1",
      messages,
    });
  } catch (err) {
    console.error("Failed to fetch messages:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const markConversationAsRead = async (userId, pageAccessToken) => {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/me/messages`,
      {
        recipient: { id: userId },
        sender_action: "mark_seen",
      },
      {
        params: {
          access_token: pageAccessToken,
        },
      }
    );
  } catch (err) {
    console.error("Failed to mark as read:", err.response?.data || err.message);
  }
};

const sendFacebookMessage = async (req, res) => {
  const { pageAccessToken, recipientId, message } = req.body;

  if (!pageAccessToken || !recipientId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
      recipient: { id: recipientId },
      message: { text: message }
    }, {
      params: {
        access_token: pageAccessToken
      }
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to send message:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to send message" });
  }
};

module.exports = {
  exchangeToken,
  getPages,
  getPageConversations,
  getMessagesForConversation,
  sendFacebookMessage
};
