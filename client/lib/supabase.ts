import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  excerpt?: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  slug: string;
};

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BlogPost, "id" | "created_at" | "updated_at">>;
      };
    };
  };
};
