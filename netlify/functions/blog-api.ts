import { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[];
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

// Get Netlify Blob store for blog posts
const getBlogStore = () => getStore("blog-posts");

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
  const pathname = url.pathname.replace("/.netlify/functions/blog-api", "");
  const method = req.method;

  const store = getBlogStore();

  try {
    // GET all posts
    if (method === "GET" && pathname === "") {
      const posts = await store.list();
      const allPosts: BlogPost[] = [];

      for (const { key } of posts.blobs) {
        const postData = await store.get(key, { type: "json" });
        if (postData) {
          allPosts.push(postData as BlogPost);
        }
      }

      // Sort by created_at desc
      allPosts.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      return new Response(JSON.stringify(allPosts), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // GET post by slug
    if (method === "GET" && pathname.startsWith("/")) {
      const slug = pathname.substring(1);
      const posts = await store.list();

      for (const { key } of posts.blobs) {
        const postData = (await store.get(key, { type: "json" })) as BlogPost;
        if (postData && postData.slug === slug) {
          return new Response(JSON.stringify(postData), {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          });
        }
      }

      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // POST - Create new post
    if (method === "POST" && pathname === "") {
      const body = await req.json();
      const { title, content, excerpt, tags = [], status = "draft" } = body;

      if (!title || !content) {
        return new Response(
          JSON.stringify({ error: "Title and content are required" }),
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
      const slug = generateSlug(title);
      const now = new Date().toISOString();

      const newPost: BlogPost = {
        id,
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150) + "...",
        tags,
        status,
        created_at: now,
        updated_at: now,
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

    // PUT - Update post
    if (method === "PUT" && pathname.startsWith("/")) {
      const id = pathname.substring(1);
      const body = await req.json();

      const existingPost = (await store.get(id, { type: "json" })) as BlogPost;
      if (!existingPost) {
        return new Response(JSON.stringify({ error: "Post not found" }), {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }

      const updatedPost: BlogPost = {
        ...existingPost,
        ...body,
        id,
        updated_at: new Date().toISOString(),
      };

      // Update slug if title changed
      if (body.title && body.title !== existingPost.title) {
        updatedPost.slug = generateSlug(body.title);
      }

      await store.set(id, JSON.stringify(updatedPost));

      return new Response(JSON.stringify(updatedPost), {
        status: 200,
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
    console.error("Blog API error:", error);
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
  path: "/blog-api/*",
};