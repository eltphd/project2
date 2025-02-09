import { generateCaption, generateThumbnail } from "../services/openai";
import { uploadToDropbox } from "../services/dropbox";
import { bot } from "../services/telegram";
import { logger } from "../utils/logger";

interface ProcessVideoParams {
  fileId: string;
  chatId: number;
  prompt?: string;
}

interface ProcessingResult {
  status: "completed" | "processing";
  data?: {
    videoUrl: string;
    thumbnailUrl: string;
    caption: string;
  };
}

/**
 * Downloads a video from Telegram and processes it.
 */
export async function processVideo({ fileId, chatId, prompt }: ProcessVideoParams): Promise<ProcessingResult> {
  try {
    // Get file path from Telegram API
    const fileUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`;
    const fileResponse = await fetch(fileUrl);
    const fileData = await fileResponse.json();

    if (!fileData.ok) {
      throw new Error("Failed to fetch file path from Telegram API.");
    }

    const filePath = fileData.result.file_path;
    if (!filePath) {
      throw new Error("File path is missing.");
    }

    const downloadUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;

    // Upload video to Dropbox
    const videoUrl = await uploadToDropbox(downloadUrl);

    // Generate AI thumbnail and caption
    const thumbnailUrl = await generateThumbnail(prompt || "Generate a relevant thumbnail.");
    const caption = await generateCaption(prompt || "Generate a social media caption.");

    // Send processing results back to the user
    await bot.sendMessage(chatId, `✅ Video processed!\n\n📹 Video: ${videoUrl}\n🖼️ Thumbnail: ${thumbnailUrl}\n📝 Caption: ${caption}`);

    return {
      status: "completed",
      data: { videoUrl, thumbnailUrl, caption },
    };
  } catch (error) {
    logger.error("Error processing video:", error);
    await bot.sendMessage(chatId, "❌ Failed to process the video. Please try again.");
    return { status: "processing" };
  }
}
