# Telegram Video Processor Bot

A comprehensive Telegram bot that automatically processes videos sent by users, uploads them to Dropbox for storage, and uses OpenAI's GPT-4 and DALL-E 3 to generate AI-powered captions and thumbnails.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)
- [API Integrations](#api-integrations)

## 🎯 Overview

This repository contains a **Telegram bot** built with Node.js and TypeScript that provides automated video processing services. When users send video files to the bot, it:

1. **Downloads** the video from Telegram
2. **Uploads** it to Dropbox cloud storage
3. **Generates** an AI-powered caption using GPT-4
4. **Creates** a custom thumbnail using DALL-E 3
5. **Returns** all processed content back to the user via Telegram

The bot is designed to run as a webhook-based service, deployable on platforms like Railway, and includes comprehensive error handling and logging.

## ✨ Features

- 🤖 **Telegram Bot Integration**: Receives and processes video messages from users
- ☁️ **Dropbox Storage**: Automatically uploads videos to Dropbox and generates shareable links
- 🤖 **AI Caption Generation**: Uses OpenAI's GPT-4 to generate social media-ready captions
- 🎨 **AI Thumbnail Generation**: Creates custom thumbnails using DALL-E 3
- 📝 **Structured Logging**: Winston-based logging system for debugging and monitoring
- 🔒 **Environment Validation**: Zod-based schema validation for environment variables
- 🚀 **Production Ready**: Configured for deployment on Railway with webhook support
- ⚡ **TypeScript**: Fully typed codebase for better maintainability

## 🏗️ Architecture

The application follows a modular architecture:

```
┌─────────────┐
│   Telegram  │
│     Bot     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Video Processor │
└──────┬───────────┘
       │
       ├──► Dropbox (Storage)
       ├──► OpenAI GPT-4 (Caption)
       └──► OpenAI DALL-E 3 (Thumbnail)
```

### Flow Diagram

1. **User** sends video to Telegram bot
2. **Bot** receives message and triggers video processor
3. **Video Processor**:
   - Downloads video from Telegram API
   - Uploads to Dropbox
   - Calls OpenAI for caption generation
   - Calls OpenAI for thumbnail generation
4. **Bot** sends results back to user

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Telegram Bot Token** (get from [@BotFather](https://t.me/BotFather))
- **Dropbox Access Token** (create at [Dropbox Developers](https://www.dropbox.com/developers))
- **OpenAI API Key** (get from [OpenAI Platform](https://platform.openai.com/api-keys))

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd project2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory:
   ```bash
   cp .env.example .env  # If example exists, or create manually
   ```

4. **Configure environment variables** (see [Configuration](#configuration) section)

5. **Build the TypeScript code**:
   ```bash
   npm run build
   ```

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Required: Telegram Bot Token from @BotFather
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Required: Dropbox Access Token
DROPBOX_ACCESS_TOKEN=your_dropbox_access_token_here

# Required: OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Webhook URL for production deployment
WEBHOOK_URL=https://your-domain.com/webhook

# Optional: Server port (defaults to 3000)
PORT=3000
```

### Getting API Credentials

#### Telegram Bot Token
1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy the token provided

#### Dropbox Access Token
1. Go to [Dropbox Developers Console](https://www.dropbox.com/developers)
2. Create a new app
3. Generate an access token with file upload permissions
4. Copy the token

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key (store it securely, it won't be shown again)

## 💻 Usage

### Development Mode

Run the bot in development mode with hot-reload:

```bash
npm run dev
```

This uses `tsx watch` to automatically restart the server when files change.

### Production Mode

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

### Using the Bot

1. **Start a conversation** with your bot on Telegram
2. **Send a video file** to the bot
3. **Wait for processing** - the bot will:
   - Acknowledge receipt: "📥 Processing your video..."
   - Process the video (download, upload, generate content)
   - Send results: Video URL, thumbnail, and caption

### Example Interaction

```
User: [Sends video file]
Bot: 📥 Processing your video...
Bot: ✅ Video processed!

     📹 Video: https://dropbox.com/...
     🖼️ Thumbnail: https://oaidalleapiprodscus...
     📝 Caption: [AI-generated caption text]
```

## 📁 Project Structure

```
project2/
├── src/
│   ├── config/
│   │   └── env.ts              # Environment variable validation
│   ├── processors/
│   │   └── videoProcessor.ts  # Core video processing logic
│   ├── services/
│   │   ├── telegram.ts        # Telegram bot setup and handlers
│   │   ├── openai.ts          # OpenAI API integration
│   │   └── dropbox.ts         # Dropbox API integration
│   ├── utils/
│   │   └── logger.ts          # Winston logging configuration
│   ├── App.tsx                # React frontend (placeholder)
│   ├── main.tsx               # React entry point
│   ├── server.ts              # Express server with webhook routes
│   └── index.ts               # Additional exports
├── server.js                  # Compiled server (generated)
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration (for frontend)
├── railway.json               # Railway deployment config
├── Procfile                   # Process file for deployment
└── README.md                  # This file
```

### Key Files Explained

- **`src/server.ts`**: Express server that handles webhook requests from Telegram
- **`src/services/telegram.ts`**: Bot initialization and message handlers
- **`src/processors/videoProcessor.ts`**: Orchestrates the video processing pipeline
- **`src/services/openai.ts`**: Wraps OpenAI API calls for caption and thumbnail generation
- **`src/services/dropbox.ts`**: Handles file uploads to Dropbox
- **`src/config/env.ts`**: Validates and exports environment variables using Zod

## 🚢 Deployment

### Railway Deployment

The project is configured for deployment on [Railway](https://railway.app):

1. **Connect your repository** to Railway
2. **Set environment variables** in Railway dashboard:
   - `TELEGRAM_BOT_TOKEN`
   - `DROPBOX_ACCESS_TOKEN`
   - `OPENAI_API_KEY`
   - `WEBHOOK_URL` (Railway will provide this)
3. **Deploy** - Railway will automatically:
   - Install dependencies
   - Build TypeScript
   - Start the server using `npm start`

### Webhook Setup

After deployment, set up the Telegram webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-railway-app.up.railway.app/webhook/<YOUR_BOT_TOKEN>"
```

### Other Platforms

The application can be deployed on any Node.js hosting platform:
- **Heroku**: Uses `Procfile` for process definition
- **Vercel**: Configure as a serverless function
- **DigitalOcean App Platform**: Configure build and start commands
- **AWS/GCP**: Use Docker or direct Node.js deployment

## 🛠️ Technologies Used

### Core
- **Node.js**: Runtime environment
- **TypeScript**: Type-safe JavaScript
- **Express**: Web framework for handling webhooks

### APIs & Services
- **node-telegram-bot-api**: Telegram Bot API wrapper
- **dropbox**: Official Dropbox SDK
- **openai**: Official OpenAI SDK

### Utilities
- **Winston**: Logging library
- **Zod**: Schema validation for environment variables
- **dotenv**: Environment variable management
- **Axios**: HTTP client (used by dependencies)

### Development
- **tsx**: TypeScript execution and watch mode
- **ESLint**: Code linting
- **Vite**: Frontend build tool (for React components)

## 🔌 API Integrations

### Telegram Bot API
- **Endpoint**: Receives updates via webhook or polling
- **Methods Used**:
  - `getFile`: Downloads video files
  - `sendMessage`: Sends responses to users
  - `processUpdate`: Processes incoming updates

### Dropbox API
- **Endpoint**: `https://api.dropboxapi.com`
- **Methods Used**:
  - `filesUpload`: Uploads video files
  - `sharingCreateSharedLinkWithSettings`: Creates shareable links

### OpenAI API
- **Endpoint**: `https://api.openai.com`
- **Models Used**:
  - **GPT-4**: Text generation for captions
  - **DALL-E 3**: Image generation for thumbnails

## 🐛 Troubleshooting

### Common Issues

**Bot not responding:**
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Check webhook URL is properly configured
- Ensure server is running and accessible

**Video upload fails:**
- Verify `DROPBOX_ACCESS_TOKEN` has write permissions
- Check Dropbox storage quota
- Review error logs for specific Dropbox API errors

**OpenAI errors:**
- Verify `OPENAI_API_KEY` is valid and has credits
- Check API rate limits
- Ensure you have access to GPT-4 and DALL-E 3 models

**Environment validation errors:**
- Check `.env` file exists and contains all required variables
- Verify no extra spaces or quotes in environment variable values
- Review error messages from Zod validation

### Logs

Logs are written to:
- **Console**: All log levels
- **`combined.log`**: All logs
- **`error.log`**: Error-level logs only

## 📝 Scripts

- `npm run dev`: Start development server with hot-reload
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Start production server (requires build first)
- `npm run lint`: Run ESLint to check code quality

## 🔒 Security Notes

- **Never commit** `.env` file to version control
- Store API keys securely
- Use environment variables for all sensitive data
- Consider using secrets management services in production
- Regularly rotate API keys

## 📄 License

[Specify your license here]

## 🤝 Contributing

[Add contribution guidelines if applicable]

## 📧 Support

For issues, questions, or contributions, please [open an issue](link-to-issues) or contact the maintainers.

---

**Built with ❤️ using TypeScript, Node.js, and AI APIs**

