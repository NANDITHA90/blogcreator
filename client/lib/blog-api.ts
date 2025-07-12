import { NetlifyBlogAPI } from "./netlify-blog-api";
import { BlogPost } from "./supabase";

// Use Netlify API as the primary backend
export class BlogAPI {
  static isSupabaseConfigured(): boolean {
    // Since we're using Netlify, return false to indicate Supabase is not configured
    // but we have a working backend
    return false;
  }

  static isNetlifyConfigured(): boolean {
    return true;
  }

  static async getAllPosts(): Promise<BlogPost[]> {
    try {
      return await NetlifyBlogAPI.getAllPosts();
    } catch (error) {
      console.warn(
        "Failed to fetch from Netlify API, using sample data:",
        error,
      );
      // Return sample data as fallback
      return this.getSamplePosts();
    }
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      return await NetlifyBlogAPI.getPostBySlug(slug);
    } catch (error) {
      console.warn(
        "Failed to fetch from Netlify API, checking sample data:",
        error,
      );
      // Check sample data as fallback
      const samplePosts = this.getSamplePosts();
      return samplePosts.find((post) => post.slug === slug) || null;
    }
  }

  static async createPost(
    post: Omit<BlogPost, "id" | "created_at" | "updated_at">,
  ): Promise<BlogPost> {
    try {
      const result = await NetlifyBlogAPI.createPost(post);

      // In development mode with demo data, the post was created locally
      if (
        import.meta.env.MODE === "development" &&
        result.id.startsWith("demo-")
      ) {
        console.info("Demo mode: Post created locally for preview");
      }

      return result;
    } catch (error) {
      console.error("Error creating post with Netlify API:", error);

      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to create post with Netlify Functions",
      );
    }
  }

  static async updatePost(
    id: string,
    updates: Partial<Omit<BlogPost, "id" | "created_at" | "updated_at">>,
  ): Promise<BlogPost> {
    try {
      const result = await NetlifyBlogAPI.updatePost(id, updates);

      // In development mode, the post was updated locally
      if (import.meta.env.MODE === "development") {
        console.info("Demo mode: Post updated locally for preview");
      }

      return result;
    } catch (error) {
      console.error("Error updating post with Netlify API:", error);

      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update post with Netlify Functions",
      );
    }
  }

  static async deletePost(id: string): Promise<void> {
    try {
      await NetlifyBlogAPI.deletePost(id);

      // In development mode, the post was deleted locally
      if (import.meta.env.MODE === "development") {
        console.info("Demo mode: Post deleted locally for preview");
      }
    } catch (error) {
      console.error("Error deleting post with Netlify API:", error);

      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to delete post with Netlify Functions",
      );
    }
  }

  static generateSlug(title: string): string {
    return NetlifyBlogAPI.generateSlug(title);
  }

  static generateExcerpt(content: string, length: number = 150): string {
    return NetlifyBlogAPI.generateExcerpt(content, length);
  }

  private static getSamplePosts(): BlogPost[] {
    return [
      {
        id: "sample-1",
        title: "Welcome to QuickBlog on Netlify",
        content: `# Welcome to QuickBlog on Netlify!

Your blog is now powered by Netlify Functions and Blob storage. This provides:

## Benefits of Netlify Backend

- **Serverless Functions**: Automatic scaling and no server management
- **Blob Storage**: Fast, distributed data storage
- **Global CDN**: Lightning-fast content delivery
- **Automatic Deployments**: Deploy on every git push

## Getting Started

1. **Create Posts**: Use the Create Post button to add new content
2. **Edit Content**: Click edit on any post to make changes
3. **Manage Drafts**: Save drafts before publishing
4. **Deploy**: Your changes deploy automatically to Netlify

Your blog is ready to use with Netlify's powerful infrastructure!`,
        excerpt:
          "Welcome to your new QuickBlog powered by Netlify Functions and Blob storage!",
        tags: ["welcome", "netlify", "serverless", "blog"],
        status: "published",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        slug: "welcome-to-quickblog-netlify",
      },
      {
        id: "sample-2",
        title: "How Netlify Functions Power Your Blog",
        content: `# How Netlify Functions Power Your Blog

Your QuickBlog is now running on Netlify's serverless platform:

## Architecture

- **Frontend**: React SPA hosted on Netlify CDN
- **Backend**: Netlify Functions for API endpoints
- **Storage**: Netlify Blob store for blog data
- **Deployment**: Automatic builds and deployments

## Benefits

- **No Server Management**: Netlify handles all infrastructure
- **Automatic Scaling**: Functions scale based on demand
- **Global Performance**: CDN delivery worldwide
- **Cost Effective**: Pay only for what you use

Start creating your own content and experience the power of serverless blogging!`,
        excerpt:
          "Learn how Netlify Functions and Blob storage create a powerful serverless blog platform.",
        tags: ["netlify", "serverless", "functions", "architecture"],
        status: "published",
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        slug: "netlify-functions-power-blog",
      },
    ];
  }
}
