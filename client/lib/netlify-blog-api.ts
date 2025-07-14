import { BlogPost } from "./supabase";
import { DemoPostStorage } from "./demo-storage";

export class NetlifyBlogAPI {
  private static baseUrl =
    import.meta.env.MODE === "production"
      ? ""
      : "http://localhost:8888/.netlify/functions";

  private static isNetlifyAvailable = false;

  // Check if Netlify Functions are available
  private static async checkNetlifyAvailability(): Promise<boolean> {
    try {
      // In development, just assume not available to skip network calls
      if (import.meta.env.MODE === "development") {
        this.isNetlifyAvailable = false;
        return false;
      }

      const response = await fetch(`${this.baseUrl}/blog-api`, {
        method: "HEAD",
      });
      this.isNetlifyAvailable = response.ok;
      return this.isNetlifyAvailable;
    } catch (error) {
      this.isNetlifyAvailable = false;
      return false;
    }
  }

  static async getAllPosts(): Promise<BlogPost[]> {
    // In development, check if Netlify Functions are available
    if (import.meta.env.MODE === "development") {
      const available = await this.checkNetlifyAvailability();
      if (!available) {
        console.info(
          "Netlify Functions not available in development, using demo storage",
        );
        // Return demo posts from localStorage
        return DemoPostStorage.getDemoPosts();
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/.netlify/functions/blog-api`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn("Error fetching posts from Netlify:", error);
      // In development, fall back to demo posts
      if (import.meta.env.MODE === "development") {
        return DemoPostStorage.getDemoPosts();
      }
      return [];
    }
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // In development, check if Netlify Functions are available
    if (import.meta.env.MODE === "development" && !this.isNetlifyAvailable) {
      const available = await this.checkNetlifyAvailability();
      if (!available) {
        console.info(
          "Netlify Functions not available in development, checking demo storage",
        );
        // Check demo storage first
        return DemoPostStorage.getDemoPostBySlug(slug);
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/.netlify/functions/blog-api/${slug}`);
      if (response.status === 404) {
        // In development, fall back to demo storage
        if (import.meta.env.MODE === "development") {
          return DemoPostStorage.getDemoPostBySlug(slug);
        }
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn("Error fetching post from Netlify:", error);
      // In development, fall back to demo storage
      if (import.meta.env.MODE === "development") {
        return DemoPostStorage.getDemoPostBySlug(slug);
      }
      return null;
    }
  }

  static async createPost(
    post: Omit<BlogPost, "id" | "created_at" | "updated_at">,
  ): Promise<BlogPost> {
    // In development, simulate post creation
    if (import.meta.env.MODE === "development") {
      const available = await this.checkNetlifyAvailability();
      if (!available) {
        // Create a demo post and save to localStorage
        const id = `demo-${Date.now()}`;
        const now = new Date().toISOString();

        const newPost: BlogPost = {
          id,
          ...post,
          slug: this.generateSlug(post.title),
          excerpt: post.excerpt || this.generateExcerpt(post.content),
          created_at: now,
          updated_at: now,
        };

        // Save to demo storage
        DemoPostStorage.saveDemoPost(newPost);

        return newPost;
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/.netlify/functions/blog-api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating post:", error);
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
    // In development, simulate post update
    if (import.meta.env.MODE === "development") {
      const available = await this.checkNetlifyAvailability();
      if (!available) {
        // Update demo post in localStorage
        const updatedPost = DemoPostStorage.updateDemoPost(id, updates);
        if (updatedPost) {
          return updatedPost;
        }

        // If post not found in demo storage, create a fallback
        const now = new Date().toISOString();
        const fallbackPost: BlogPost = {
          id,
          title: updates.title || "Updated Post",
          content: updates.content || "Updated content",
          tags: updates.tags || [],
          excerpt:
            updates.excerpt ||
            this.generateExcerpt(updates.content || "Updated content"),
          status: updates.status || "published",
          slug: updates.title
            ? this.generateSlug(updates.title)
            : `updated-${id}`,
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updated_at: now,
        };

        DemoPostStorage.saveDemoPost(fallbackPost);
        return fallbackPost;
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/.netlify/functions/blog-api/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating post:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update post with Netlify Functions",
      );
    }
  }

  static async deletePost(id: string): Promise<void> {
    // In development, simulate post deletion
    if (import.meta.env.MODE === "development") {
      const available = await this.checkNetlifyAvailability();
      if (!available) {
        // Delete from demo storage
        const deleted = DemoPostStorage.deleteDemoPost(id);
        console.info(
          `Demo mode: ${deleted ? "Deleted" : "Attempted to delete"} post ${id}`,
        );
        return;
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/.netlify/functions/blog-api/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to delete post with Netlify Functions",
      );
    }
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  static generateExcerpt(content: string, length: number = 150): string {
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length <= length
      ? plainText
      : plainText.slice(0, length) + "...";
  }

  static isNetlifyConfigured(): boolean {
    // Always true since we're using Netlify Functions
    return true;
  }
}
