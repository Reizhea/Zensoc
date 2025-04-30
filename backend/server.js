const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const fbRoutes = require("./routes/fbRoutes");
const instaRoutes = require("./routes/instaRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api/facebook", fbRoutes);
app.use("/api/instagram", instaRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));