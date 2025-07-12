// Image upload utility for QuickBlog
// This provides a foundation for image upload functionality

export interface UploadedImage {
  url: string;
  alt: string;
  caption?: string;
}

export class ImageUploadAPI {
  static async uploadImage(file: File): Promise<UploadedImage> {
    // For demo mode - simulate upload
    if (!this.isSupabaseConfigured()) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const demoUrl = URL.createObjectURL(file);
          resolve({
            url: demoUrl,
            alt: file.name,
            caption: `Demo image: ${file.name}`,
          });
        }, 1000);
      });
    }

    // For production with Supabase Storage
    // This would integrate with Supabase Storage buckets
    throw new Error(
      "Supabase image upload not implemented yet. Connect Supabase to enable image uploads.",
    );
  }

  static isSupabaseConfigured(): boolean {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return !!(
      url &&
      key &&
      url !== "https://your-project.supabase.co" &&
      key !== "your-anon-key"
    );
  }

  static validateImage(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "Image size must be less than 5MB",
      };
    }

    return { valid: true };
  }

  static generateImageMarkdown(image: UploadedImage): string {
    return `![${image.alt}](${image.url}${image.caption ? ` "${image.caption}"` : ""})`;
  }
}

// Future enhancement: Supabase Storage integration
// See DATABASE_SETUP.md for complete setup instructions
