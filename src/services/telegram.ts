import TelegramBot from 'node-telegram-bot-api';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { processVideo } from '../processors/videoProcessor';

const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, {
  polling: !env.WEBHOOK_URL,
  webHook: env.WEBHOOK_URL ? { port: 8443 } : undefined,
});

export const initializeTelegramBot = () => {
  bot.on('message', async (msg) => {
    try {
      const video = msg.video || (msg.document?.mime_type?.startsWith('video/') ? msg.document : null);
      
      if (!video) {
        await bot.sendMessage(msg.chat.id, 'Please send a video file.');
        return;
      }

      await bot.sendMessage(msg.chat.id, 'Processing your video...');
      
      const result = await processVideo({
        fileId: video.file_id,
        chatId: msg.chat.id,
        prompt: msg.caption || '',
        bot,
      });

      if (result.status === 'processing') {
        await bot.sendMessage(
          msg.chat.id,
          'Your video is being processed. You will receive a notification when it\'s ready.'
        );
      }
    } catch (error) {
      logger.error('Error processing message:', error);
      await bot.sendMessage(
        msg.chat.id,
        'Sorry, there was an error processing your video. Please try again later.'
      );
    }
  });

  logger.info('Telegram bot initialized');
};

export { bot };