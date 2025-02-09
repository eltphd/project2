import { Dropbox } from 'dropbox';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const dbx = new Dropbox({ accessToken: env.DROPBOX_ACCESS_TOKEN });

export const uploadToDropbox = async (
  buffer: Buffer,
  filename: string
): Promise<string> => {
  try {
    const response = await dbx.filesUpload({
      path: `/${filename}`,
      contents: buffer,
    });

    const shareResponse = await dbx.sharingCreateSharedLink({
      path: response.result.path_display,
    });

    return shareResponse.result.url.replace('dl=0', 'dl=1');
  } catch (error) {
    logger.error('Dropbox upload error:', error);
    throw new Error('Failed to upload file to Dropbox');
  }
};