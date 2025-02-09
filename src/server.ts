import express from "express";
import dotenv from "dotenv";
import { bot } from "./services/telegram";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Ensure we use Railway's assigned port

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route for Debugging
app.get("/", (req, res) => {
  res.send("✅ Telegram Video Processor is Running!");
});

// Webhook for Telegram Bot
app.post(`/webhook/${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

