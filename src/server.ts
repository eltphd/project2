import express from "express";
import { config } from "dotenv";

config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Telegram Webhook Route
app.post("/webhook", (req, res) => {
  console.log("Received Telegram Update:", req.body);
  res.sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
