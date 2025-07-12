import { supabase, type BlogPost } from "./supabase";

export class BlogAPI {
  static async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }

    return data || [];
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching post:", error);
      throw error;
    }

    return data;
  }

  static async createPost(
    post: Omit<BlogPost, "id" | "created_at" | "updated_at">,
  ): Promise<BlogPost> {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(post)
      .select()
      .single();

    if (error) {
      console.error("Error creating post:", error);
      throw error;
    }

    return data;
  }

  static async updatePost(
    id: string,
    updates: Partial<Omit<BlogPost, "id" | "created_at" | "updated_at">>,
  ): Promise<BlogPost> {
    const { data, error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating post:", error);
      throw error;
    }

    return data;
  }

  static async deletePost(id: string): Promise<void> {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting post:", error);
      throw error;
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
