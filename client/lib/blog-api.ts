import { Post, CreatePostData } from "./types";

export class BlogAPI {
  private static baseUrl = 
    import.meta.env.MODE === "production" 
      ? "/.netlify/functions" 
      : "http://localhost:8888/.netlify/functions";

  static async getAllPosts(): Promise<Post[]> {
    try {
      const response = await fetch(`${this.baseUrl}/posts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  }

  static async getPostById(id: string): Promise<Post | null> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${id}`);
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

  static async createPost(postData: CreatePostData): Promise<Post> {
    try {
      const response = await fetch(`${this.baseUrl}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  static async deletePost(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }
}