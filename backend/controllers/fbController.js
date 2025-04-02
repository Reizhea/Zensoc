const { fetchFacebookMessages } = require('../services/graphAPI');

exports.getFacebookMessages = async (req, res) => {
  try {
    const messages = await fetchFacebookMessages();
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
