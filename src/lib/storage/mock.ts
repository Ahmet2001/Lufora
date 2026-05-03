import type { IStorageService, UploadResult } from "./types";

/**
 * Mock storage service — returns placeholder image URLs.
 * Used during development when no cloud storage is configured.
 */
class MockStorageService implements IStorageService {
  async upload(
    _file: Buffer,
    filename: string,
    folder: string
  ): Promise<UploadResult> {
    // Simulate upload delay
    await new Promise((r) => setTimeout(r, 300));

    const id = `mock_${folder}_${Date.now()}_${filename}`;
    // Use a placeholder image service
    const url = `https://placehold.co/400x400/22c55e/white?text=${encodeURIComponent(
      filename.split(".")[0] || "Plant"
    )}`;

    console.log(`[MockStorage] Uploaded: ${folder}/${filename} → ${url}`);

    return { url, publicId: id };
  }

  async delete(publicId: string): Promise<void> {
    console.log(`[MockStorage] Deleted: ${publicId}`);
  }
}

export const mockStorage = new MockStorageService();
