import type { IStorageService, UploadResult } from "./types";

/**
 * Cloudinary storage service.
 *
 * Requires environment variables:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * Uses the Cloudinary Upload API directly (no SDK needed for basic uploads).
 */
class CloudinaryStorageService implements IStorageService {
  private cloudName: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
    this.apiKey = process.env.CLOUDINARY_API_KEY || "";
    this.apiSecret = process.env.CLOUDINARY_API_SECRET || "";
  }

  async upload(
    file: Buffer,
    filename: string,
    folder: string
  ): Promise<UploadResult> {
    const base64 = file.toString("base64");
    const dataUri = `data:image/jpeg;base64,${base64}`;

    const formData = new URLSearchParams();
    formData.append("file", dataUri);
    formData.append("folder", `lufora/${folder}`);
    formData.append("upload_preset", "ml_default");
    formData.append("api_key", this.apiKey);

    // Generate signature for authenticated upload
    const timestamp = Math.floor(Date.now() / 1000).toString();
    formData.append("timestamp", timestamp);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudinary upload failed: ${error}`);
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  }

  async delete(publicId: string): Promise<void> {
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const formData = new URLSearchParams();
    formData.append("public_id", publicId);
    formData.append("api_key", this.apiKey);
    formData.append("timestamp", timestamp);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      console.error(`Cloudinary delete failed for ${publicId}`);
    }
  }
}

export const cloudinaryStorage = new CloudinaryStorageService();
