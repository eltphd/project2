import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

/**
 * Generates a social media caption using OpenAI.
 */
export async function generateCaption(prompt: string): Promise<string> {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate a short, engaging caption for social media: "${prompt}"`,
      max_tokens: 50,
    });

    return response?.data?.choices?.[0]?.text?.trim() || "No caption generated.";
  } catch (error) {
    console.error("Error generating caption:", error);
    return "Error generating caption.";
  }
}

/**
 * Generates a thumbnail image using DALL·E.
 */
export async function generateThumbnail(prompt: string): Promise<string> {
  try {
    const response = await openai.createImage({
      model: "dall-e-2",
      prompt: `Generate a stylish thumbnail image: "${prompt}"`,
      n: 1,
      size: "512x512",
    });

    return response?.data?.data?.[0]?.url || "No image generated.";
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return "Error generating thumbnail.";
  }
}

