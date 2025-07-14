import { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Get Netlify Blob store for posts
const getPostStore = () => getStore("collaborative-posts");

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

export default async (req: Request, context: Context) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const pathname = url.pathname.replace("/.netlify/functions/posts", "");
  const method = req.method;

  const store = getPostStore();

  try {
    // GET all posts
    if (method === "GET" && pathname === "") {
      const posts = await store.list();
      const allPosts: Post[] = [];

      for (const { key } of posts.blobs) {
        const postData = await store.get(key, { type: "json" });
        if (postData) {
          allPosts.push(postData as Post);
        }
      }

      // Sort by created date desc
      allPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      return new Response(JSON.stringify(allPosts), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // GET post by ID
    if (method === "GET" && pathname.startsWith("/")) {
      const id = pathname.substring(1);
      const postData = await store.get(id, { type: "json" });

      if (!postData) {
        return new Response(JSON.stringify({ error: "Post not found" }), {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }

      return new Response(JSON.stringify(postData), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // POST - Create new post
    if (method === "POST" && pathname === "") {
      const body = await req.json();
      const { title, content, author, tags = [] } = body;

      if (!title || !content || !author) {
        return new Response(
          JSON.stringify({ error: "Title, content, and author are required" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          },
        );
      }

      const id = generateId();
      const now = new Date().toISOString();

      const newPost: Post = {
        id,
        title,
        content,
        author,
        tags,
        createdAt: now,
        updatedAt: now,
      };

      await store.set(id, JSON.stringify(newPost));

      return new Response(JSON.stringify(newPost), {
        status: 201,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // DELETE post
    if (method === "DELETE" && pathname.startsWith("/")) {
      const id = pathname.substring(1);

      const existingPost = await store.get(id, { type: "json" });
      if (!existingPost) {
        return new Response(JSON.stringify({ error: "Post not found" }), {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }

      await store.delete(id);

      return new Response(
        JSON.stringify({ message: "Post deleted successfully" }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Posts API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
};

export const config: Config = {
  path: "/posts/*",
};