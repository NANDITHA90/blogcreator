import { BlogPost } from "./supabase";

export class NetlifyBlogAPI {
  private static baseUrl =
    import.meta.env.MODE === "production"
      ? "/.netlify/functions"
      : "http://localhost:8888/.netlify/functions";

  static async getAllPosts(): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/blog-api`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Return empty array for graceful fallback
      return [];
    }
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(`${this.baseUrl}/blog-api/${slug}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  }

  static async createPost(
    post: Omit<BlogPost, "id" | "created_at" | "updated_at">,
  ): Promise<BlogPost> {
    try {
      const response = await fetch(`${this.baseUrl}/blog-api`, {
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
        error instanceof Error ? error.message : "Failed to create post",
      );
    }
  }

  static async updatePost(
    id: string,
    updates: Partial<Omit<BlogPost, "id" | "created_at" | "updated_at">>,
  ): Promise<BlogPost> {
    try {
      const response = await fetch(`${this.baseUrl}/blog-api/${id}`, {
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
        error instanceof Error ? error.message : "Failed to update post",
      );
    }
  }

  static async deletePost(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/blog-api/${id}`, {
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
        error instanceof Error ? error.message : "Failed to delete post",
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
