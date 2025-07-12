import { useEffect, useState, useMemo } from "react";
import { BlogCard } from "@/components/BlogCard";
import { BlogFilters, FilterOptions } from "@/components/BlogFilters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BlogAPI } from "@/lib/blog-api";
import { BlogPost } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  BookOpen,
  TrendingUp,
  Users,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Sample data for development/preview
  const samplePosts: BlogPost[] = [
    {
      id: "1",
      title: "Getting Started with React and TypeScript",
      content:
        "React and TypeScript make a powerful combination for building scalable web applications. In this comprehensive guide, we'll explore how to set up a modern development environment, create type-safe components, and implement best practices for maintaining large codebases. Whether you're new to TypeScript or looking to improve your React skills, this post will provide valuable insights and practical examples.",
      tags: ["React", "TypeScript", "Web Development", "Frontend"],
      excerpt:
        "Learn how to build scalable web applications with React and TypeScript. A comprehensive guide covering setup, components, and best practices.",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      slug: "getting-started-react-typescript",
    },
    {
      id: "2",
      title: "Modern CSS Techniques for 2024",
      content:
        "CSS has evolved tremendously in recent years, with new features like Container Queries, CSS Grid subgrid, and advanced color functions. This post explores the latest CSS techniques that will help you create more responsive, maintainable, and visually appealing websites. We'll dive into practical examples and show you how to implement these features in real projects.",
      tags: ["CSS", "Web Design", "Frontend", "Responsive Design"],
      excerpt:
        "Discover the latest CSS features and techniques that will revolutionize your web design workflow in 2024.",
      created_at: "2024-01-12T14:30:00Z",
      updated_at: "2024-01-12T14:30:00Z",
      slug: "modern-css-techniques-2024",
    },
    {
      id: "3",
      title: "Building Scalable APIs with Node.js",
      content:
        "Creating robust and scalable APIs is crucial for modern web applications. This detailed guide walks through the process of building production-ready APIs using Node.js, Express, and modern development practices. We'll cover authentication, error handling, testing, documentation, and deployment strategies that will help you build APIs that can handle real-world traffic and requirements.",
      tags: ["Node.js", "API", "Backend", "Express", "JavaScript"],
      excerpt:
        "Learn to build production-ready APIs with Node.js and Express, covering authentication, testing, and deployment.",
      created_at: "2024-01-10T09:15:00Z",
      updated_at: "2024-01-10T09:15:00Z",
      slug: "building-scalable-apis-nodejs",
    },
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await BlogAPI.getAllPosts();

      if (data.length > 0) {
        // Use real Supabase data
        setPosts(data);
      } else {
        // Use sample data for demo (either no data or Supabase not configured)
        setPosts(samplePosts);
        if (!BlogAPI.isSupabaseConfigured()) {
          toast({
            title: "Demo Mode",
            description:
              "Connect to Supabase through MCP Servers to manage real blog posts. Currently showing sample data.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error(
        "Unexpected error loading posts:",
        error instanceof Error ? error.message : String(error),
      );
      // Use sample data as fallback
      setPosts(samplePosts);
      toast({
        title: "Using Demo Data",
        description: "Unable to load posts. Currently showing sample data.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await BlogAPI.deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
      toast({
        title: "Post Deleted",
        description: "The blog post has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).slice(
    0,
    8,
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-blue-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-600 via-brand-500 to-blue-600 bg-clip-text text-transparent">
              Welcome to QuickBlog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover insightful articles, tutorials, and thoughts on web
              development, technology, and everything in between.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-brand-500 to-blue-500 hover:from-brand-600 hover:to-blue-600"
            >
              <Link to="/create" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Write Your First Post</span>
              </Link>
            </Button>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{posts.length} Posts</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Growing Community</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Open Source</span>
              </div>
            </div>
          </div>

          {/* Search and Tags */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search posts, tags, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-brand-200 focus:border-brand-400"
              />
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-brand-50 hover:border-brand-300 transition-colors"
                    onClick={() => setSearchTerm(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {filteredPosts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">
                  {searchTerm
                    ? `Search Results (${filteredPosts.length})`
                    : "Latest Posts"}
                </h2>
                {searchTerm && (
                  <Button variant="ghost" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? "No posts found" : "No posts yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? "Try adjusting your search terms or browse all posts."
                  : "Be the first to share your thoughts and create a new post."}
              </p>
              <div className="flex justify-center space-x-4">
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    View All Posts
                  </Button>
                )}
                <Button asChild>
                  <Link to="/create">Create First Post</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
