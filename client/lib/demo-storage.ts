import { BlogPost } from "./supabase";

// Simple local storage for demo posts
export class DemoPostStorage {
  private static readonly STORAGE_KEY = "quickblog_demo_posts";

  static saveDemoPost(post: BlogPost): void {
    if (import.meta.env.MODE !== "development") return;

    const existingPosts = this.getDemoPosts();
    const updatedPosts = [
      ...existingPosts.filter((p) => p.id !== post.id),
      post,
    ];

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPosts));
    } catch (error) {
      console.warn("Failed to save demo post to localStorage:", error);
    }
  }

  static getDemoPosts(): BlogPost[] {
    if (import.meta.env.MODE !== "development") return [];

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn("Failed to load demo posts from localStorage:", error);
      return [];
    }
  }

  static getDemoPostBySlug(slug: string): BlogPost | null {
    const demoPosts = this.getDemoPosts();
    return demoPosts.find((post) => post.slug === slug) || null;
  }

  static updateDemoPost(
    id: string,
    updates: Partial<BlogPost>,
  ): BlogPost | null {
    if (import.meta.env.MODE !== "development") return null;

    const demoPosts = this.getDemoPosts();
    const postIndex = demoPosts.findIndex((p) => p.id === id);

    if (postIndex === -1) return null;

    const updatedPost = {
      ...demoPosts[postIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    demoPosts[postIndex] = updatedPost;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demoPosts));
      return updatedPost;
    } catch (error) {
      console.warn("Failed to update demo post in localStorage:", error);
      return null;
    }
  }

  static deleteDemoPost(id: string): boolean {
    if (import.meta.env.MODE !== "development") return false;

    const demoPosts = this.getDemoPosts();
    const filteredPosts = demoPosts.filter((p) => p.id !== id);

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredPosts));
      return true;
    } catch (error) {
      console.warn("Failed to delete demo post from localStorage:", error);
      return false;
    }
  }

  static clearAllDemoPosts(): void {
    if (import.meta.env.MODE !== "development") return;

    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear demo posts from localStorage:", error);
    }
  }
}
