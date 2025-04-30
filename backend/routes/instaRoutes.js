const express = require("express");
const router = express.Router();
const { getInstagramBusinessId,
        getInstagramConversations,
        getInstagramMessages,
        sendInstagramMessage,
 } = require("../controllers/instaController");

router.post("/get-instagram-id", getInstagramBusinessId);
router.get("/conversations", getInstagramConversations);
router.get("/conversation/:id/messages", getInstagramMessages);
router.post("/send-message", sendInstagramMessage);

module.exports = router;