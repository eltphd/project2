import axios from 'axios';
import { bot } from '../services/telegram';
import { uploadToDropbox } from '../services/dropbox';
import { generateCaption, generateThumbnail } from '../services/openai';
import { logger } from '../utils/logger';

interface ProcessVideoParams {
  fileId: string;
  chatId: number;
  prompt: string;
  bot: typeof bot;
}

interface ProcessingResult {
  status: 'completed' | 'processing';
  data?: {
    videoUrl: string;
    thumbnailUrl: string;
    caption: string;
    hashtags: string[];
  };
}

export const processVideo = async ({
  fileId,
  chatId,
  prompt,
  bot,
}: ProcessVideoParams): Promise<ProcessingResult> => {
  try {
    // Get file info from Telegram
    const file = await bot.getFile(fileId);
    const videoBuffer = await downloadFile(file.file_path);

    // Upload to Dropbox
    const filename = `video_${Date.now()}.mp4`;
    const videoUrl = await uploadToDropbox(videoBuffer, filename);

    // Generate caption and thumbnail in parallel
    const [captionData, thumbnailUrl] = await Promise.all([
      generateCaption(prompt || 'Create a general caption for this video'),
      generateThumbnail(prompt || 'Create a thumbnail for this video'),
    ]);

    // Send the results back to the user
    const message = [
      '✨ Your video has been processed!\n',
      `📝 Caption: ${captionData.caption}\n`,
      `🏷️ Hashtags: ${captionData.hashtags.join(' ')}\n`,
      `🔑 Keywords: ${captionData.keywords.join(', ')}\n`,
      `\n📺 Video: ${videoUrl}`,
      `\n🖼️ Thumbnail: ${thumbnailUrl}`,
    ].join('\n');

    await bot.sendMessage(chatId, message);

    return {
      status: 'completed',
      data: {
        videoUrl,
        thumbnailUrl,
        caption: captionData.caption,
        hashtags: captionData.hashtags,
      },
    };
  } catch (error) {
    logger.error('Video processing error:', error);
    throw error;
  }
};

async function downloadFile(filePath: string): Promise<Buffer> {
  try {
    const response = await axios.get(filePath, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch (error) {
    logger.error('File download error:', error);
    throw new Error('Failed to download file');
  }
}