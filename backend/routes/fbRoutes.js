const express = require("express");
const router = express.Router();
const {getPages, 
       exchangeToken, 
       getPageConversations, 
       getMessagesForConversation,
       sendFacebookMessage
    } = require("../controllers/fbController");

router.post("/long-token", exchangeToken);
router.post("/get-pages", getPages);
router.get("/page-conversations", getPageConversations);
router.get("/conversation/:id/messages", getMessagesForConversation);
router.post("/send-message", sendFacebookMessage);

module.exports = router;
