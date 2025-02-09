import OpenAI from 'openai';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const generateCaption = async (prompt: string): Promise<{
  caption: string;
  hashtags: string[];
  keywords: string[];
}> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Generate a social media caption, hashtags, and SEO keywords for a video.',
        },
        {
          role: 'user',
          content: `Create a caption (max 150 characters), 5 relevant hashtags, and 3 SEO keywords for a video about: ${prompt}`,
        },
      ],
    });

    const response = completion.choices[0].message.content;
    const parts = response.split('\n');
    
    return {
      caption: parts[0],
      hashtags: parts[1].split(' ').filter(tag => tag.startsWith('#')),
      keywords: parts[2].split(',').map(k => k.trim()),
    };
  } catch (error) {
    logger.error('OpenAI caption generation error:', error);
    throw new Error('Failed to generate caption');
  }
};

export const generateThumbnail = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create a thumbnail image for a video about: ${prompt}`,
      n: 1,
      size: '1024x1024',
    });

    return response.data[0].url;
  } catch (error) {
    logger.error('OpenAI thumbnail generation error:', error);
    throw new Error('Failed to generate thumbnail');
  }
};