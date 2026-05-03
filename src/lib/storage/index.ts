/**
 * Storage barrel export.
 *
 * Automatically selects the storage provider based on environment variables.
 * - If CLOUDINARY_CLOUD_NAME is set → use Cloudinary
 * - Otherwise → use Mock (placeholder images)
 *
 * To add Supabase Storage, create supabase-storage.ts implementing IStorageService
 * and add a check for SUPABASE_URL here.
 */

import type { IStorageService } from "./types";
import { mockStorage } from "./mock";
import { cloudinaryStorage } from "./cloudinary";

function getStorageService(): IStorageService {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return cloudinaryStorage;
  }
  return mockStorage;
}

export const storage: IStorageService = getStorageService();

export type { IStorageService, UploadResult } from "./types";
