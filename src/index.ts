import { initializeTelegramBot } from './services/telegram';
import { logger } from './utils/logger';

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
});

try {
  // Add startup message
  console.log('\n📱 Starting Telegram Video Processor...\n');
  
  initializeTelegramBot();
  
  logger.info('Application started successfully');
  console.log('\n✅ Bot is running! Send a video to your Telegram bot to test it.\n');
} catch (error) {
  logger.error('Failed to start application:', error);
  process.exit(1);
}