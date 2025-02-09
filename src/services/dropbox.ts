import { Dropbox } from "dropbox";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch });

/**
 * Uploads a file to Dropbox.
 */
export async function uploadToDropbox(fileUrl: string): Promise<string> {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to download file.");

    const fileBuffer = await response.buffer();
    const fileName = `/videos/${Date.now()}.mp4`;

    const uploadResponse = await dbx.filesUpload({
      path: fileName,
      contents: fileBuffer,
      mode: { ".tag": "add" },
    });

    if (!uploadResponse.result.path_display) throw new Error("Dropbox upload failed.");
    
    const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: uploadResponse.result.path_display,
    });

    return sharedLinkResponse.result.url.replace("?dl=0", "?raw=1");
  } catch (error) {
    console.error("Error uploading to Dropbox:", error);
    throw new Error("Failed to upload to Dropbox.");
  }
}
