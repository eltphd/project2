import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string({
    required_error: "TELEGRAM_BOT_TOKEN is required. Get one from @BotFather on Telegram.",
  }),
  DROPBOX_ACCESS_TOKEN: z.string({
    required_error: "DROPBOX_ACCESS_TOKEN is required. Create one at https://www.dropbox.com/developers",
  }),
  OPENAI_API_KEY: z.string({
    required_error: "OPENAI_API_KEY is required. Get one from https://platform.openai.com/api-keys",
  }),
  WEBHOOK_URL: z.string().optional(),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error("Environment Configuration Error:");
      error.errors.forEach((err) => {
        logger.error(`- ${err.message}`);
      });
      
      console.error("\n🚨 Missing Environment Variables 🚨");
      console.error("\nPlease create a .env file with the following variables:");
      console.error(`
TELEGRAM_BOT_TOKEN=   # Get from @BotFather on Telegram
DROPBOX_ACCESS_TOKEN= # Get from Dropbox Developer Console
OPENAI_API_KEY=       # Get from OpenAI Dashboard
WEBHOOK_URL=         # Optional: Your production webhook URL
`);
    }
    process.exit(1);
  }
}

export const env = validateEnv();