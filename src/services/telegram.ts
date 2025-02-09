import TelegramBot from "node-telegram-bot-api";
import { processVideo } from "../processors/videoProcessor";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  try {
    if (msg.video) {
      await bot.sendMessage(msg.chat.id, "📥 Processing your video...");

      const result = await processVideo({
        fileId: msg.video.file_id,
        chatId: msg.chat.id,
      });

      if (result.status === "completed" && result.data) {
        await bot.sendMessage(
          msg.chat.id,
          `✅ Video processed!\n📹 ${result.data.videoUrl}`
        );
      } else {
        await bot.sendMessage(
          msg.chat.id,
          "⚠️ Video processing is still ongoing. Please wait."
        );
      }
    } else {
      await bot.sendMessage(
        msg.chat.id,
        "❌ Please send a video file for processing."
      );
    }
  } catch (error) {
    logger.error("Telegram bot error:", error);
    await bot.sendMessage(msg.chat.id, "❌ An error occurred. Please try again.");
  }
});

logger.info("🤖 Telegram bot is running...");
