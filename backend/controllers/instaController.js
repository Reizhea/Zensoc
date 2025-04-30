const axios = require("axios");

const getInstagramBusinessId = async (req, res) => {
  const { pageId, accessToken } = req.body;

  if (!pageId || !accessToken) {
    return res.status(400).json({ error: "Missing pageId or accessToken." });
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;
    const response = await axios.get(url);

    const instagramAccount = response.data.instagram_business_account;

    if (!instagramAccount || !instagramAccount.id) {
      return res.status(404).json({ error: "No Instagram Business Account connected to this Page." });
    }

    return res.status(200).json({ instagramId: instagramAccount.id });
  } catch (error) {
    console.error("Error fetching Instagram Business Account:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch Instagram Business Account." });
  }
};

const getInstagramConversations = async (req, res) => {
  const pageAccessToken = req.query.token;
  const pageId = req.query.pageId;
  const userId = req.query.userId;

  if (!pageAccessToken || !pageId || !userId) {
    return res.status(400).json({ error: "Missing token, pageId or userId." });
  }

  try {
    const convoRes = await axios.get(
      `https://graph.facebook.com/v19.0/${pageId}/conversations`,
      {
        params: {
          platform: "instagram",
          fields: "id,updated_time,unread_count",
          access_token: pageAccessToken,
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
      if (!latest?.message) continue;

      let senderName = "Unknown";
      try {
        const participantRes = await axios.get(
          `https://graph.facebook.com/v19.0/${convo.id}`,
          {
            params: {
              access_token: pageAccessToken,
              fields: "participants{id,username}",
            },
          }
        );

        const participants = participantRes.data.participants?.data || [];
        const otherPerson = participants.find((p) => p.id !== userId);
        senderName = otherPerson?.username || "Unknown";
      } catch (e) {
        console.warn(`Failed to fetch participants for convo ${convo.id}`);
      }

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
        name: senderName,
        lastMessage: latest.message,
        displayTime,
        hasUnread: convo.unread_count > 0,
        unreadCount: convo.unread_count || 0,
        icon: "user",
        iconColor: "#C13584",
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching Instagram conversations:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to fetch Instagram conversations." });
  }
};

const getInstagramMessages = async (req, res) => {
  const pageAccessToken = req.query.token;
  const userName = req.query.name || "Unknown";
  const threadId = req.params.id;
  const pageId = req.query.pageId;
  const userId = req.query.userId;

  if (!pageAccessToken || !threadId || !pageId || !userId) {
    return res.status(400).json({ error: "Missing token, threadId, pageId or userId." });
  }

  try {
    // Fetch participants first
    const participantRes = await axios.get(
      `https://graph.facebook.com/v19.0/${threadId}`,
      {
        params: {
          access_token: pageAccessToken,
          fields: "participants{id,username}",
        },
      }
    );

    const participantMap = {};
    const participants = participantRes.data.participants?.data || [];
    for (const p of participants) {
      participantMap[p.id] = p.username || "Unknown";
    }

    // Fetch messages
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
          sender: msg.from?.id === userId ? "me" : "them",
          senderName: participantMap[msg.from?.id] || "Unknown",
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
      iconColor: "#C13584",
      messages,
    });
  } catch (err) {
    console.error("Error fetching Instagram messages:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch Instagram messages." });
  }
};

const sendInstagramMessage = async (req, res) => {
  const { pageAccessToken, recipientId, message } = req.body;

  if (!pageAccessToken || !recipientId || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message },
      },
      {
        params: {
          access_token: pageAccessToken,
        },
      }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to send Instagram message:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to send Instagram message." });
  }
};

module.exports = {
  getInstagramBusinessId,
  getInstagramConversations,
  getInstagramMessages,
  sendInstagramMessage,
};
