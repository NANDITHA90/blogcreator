import { supabase, type BlogPost } from "./supabase";

export class BlogAPI {
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

  static async getAllPosts(): Promise<BlogPost[]> {
    // If Supabase is not configured, return empty array to trigger fallback
    if (!this.isSupabaseConfigured()) {
      console.info("Supabase not configured, using demo data");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn(
          "Supabase error, falling back to demo data:",
          error.message || error,
        );
        return [];
      }

      return data || [];
    } catch (error) {
      console.warn(
        "Failed to connect to Supabase, falling back to demo data:",
        error instanceof Error ? error.message : String(error),
      );
      return [];
    }
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // If Supabase is not configured, return null to trigger fallback
    if (!this.isSupabaseConfigured()) {
      console.info("Supabase not configured, using demo data");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Post not found
        }
        console.warn(
          "Supabase error, falling back to demo data:",
          error.message || error,
        );
        return null;
      }

      return data;
    } catch (error) {
      console.warn(
        "Failed to connect to Supabase, falling back to demo data:",
        error instanceof Error ? error.message : String(error),
      );
      return null;
    }
  }

  static async createPost(
    post: Omit<BlogPost, "id" | "created_at" | "updated_at">,
  ): Promise<BlogPost> {
    if (!this.isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please set up your Supabase credentials to create posts.",
      );
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(post)
      .select()
      .single();

    if (error) {
      console.error("Error creating post:", error.message || error);
      throw new Error(
        `Failed to create post: ${error.message || "Unknown error"}`,
      );
    }

    return data;
  }

  static async updatePost(
    id: string,
    updates: Partial<Omit<BlogPost, "id" | "created_at" | "updated_at">>,
  ): Promise<BlogPost> {
    if (!this.isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please set up your Supabase credentials to update posts.",
      );
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating post:", error.message || error);
      throw new Error(
        `Failed to update post: ${error.message || "Unknown error"}`,
      );
    }

    return data;
  }

  static async deletePost(id: string): Promise<void> {
    if (!this.isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please set up your Supabase credentials to delete posts.",
      );
    }

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting post:", error.message || error);
      throw new Error(
        `Failed to delete post: ${error.message || "Unknown error"}`,
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
}
