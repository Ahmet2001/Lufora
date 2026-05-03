/**
 * Storage service interface.
 *
 * All image/file uploads go through this abstraction.
 * Swap implementations by changing the export in ./index.ts.
 */
export interface UploadResult {
  url: string;
  publicId: string; // provider-specific ID for deletion
}

export interface IStorageService {
  /**
   * Upload a file and return its public URL.
   * @param file - File buffer
   * @param filename - Original filename (used for path generation)
   * @param folder - Logical folder (e.g., "plants", "journeys", "avatars")
   */
  upload(file: Buffer, filename: string, folder: string): Promise<UploadResult>;

  /**
   * Delete a previously uploaded file.
   * @param publicId - The publicId returned from upload()
   */
  delete(publicId: string): Promise<void>;
}
