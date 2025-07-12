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
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    selectedTags: [],
    dateRange: "all",
    sortBy: "newest",
    status: "all",
  });

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
      status: "published",
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
      status: "published",
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
      status: "published",
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
        // Use real Netlify data
        setPosts(data);
      } else {
        // Use sample data as starter content
        setPosts(samplePosts);
        toast({
          title: "Welcome to QuickBlog",
          description:
            import.meta.env.MODE === "development"
              ? "Your blog is ready for Netlify! Deploy to enable full functionality. Currently showing sample content."
              : "Your blog is powered by Netlify Functions! Start by creating your first post.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error(
        "Unexpected error loading posts:",
        error instanceof Error ? error.message : String(error),
      );
      // Use sample data as fallback
      setPosts(samplePosts);
      toast({
        title: "Loading Sample Data",
        description:
          "Showing sample posts while connecting to Netlify Functions.",
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

  // Advanced filtering and sorting logic
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Filter by selected tags
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        filters.selectedTags.some((tag) => post.tags.includes(tag)),
      );
    }

    // Filter by date range
    if (filters.dateRange !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      switch (filters.dateRange) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (post) => new Date(post.created_at) >= cutoffDate,
      );
    }

    // Sort posts
    switch (filters.sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "popular":
        // For now, sort by number of tags as a popularity proxy
        filtered.sort((a, b) => b.tags.length - a.tags.length);
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
    }

    return filtered;
  }, [posts, filters]);

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

          {/* Search and Quick Actions */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Quick search posts..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchTerm: e.target.value,
                    }))
                  }
                  className="pl-10 bg-white/80 backdrop-blur-sm border-brand-200 focus:border-brand-400"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/80 backdrop-blur-sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(filters.selectedTags.length > 0 ||
                  filters.dateRange !== "all" ||
                  filters.sortBy !== "newest") && (
                  <Badge variant="secondary" className="ml-2">
                    {[
                      filters.selectedTags.length > 0 ? 1 : 0,
                      filters.dateRange !== "all" ? 1 : 0,
                      filters.sortBy !== "newest" ? 1 : 0,
                    ].reduce((a, b) => a + b)}
                  </Badge>
                )}
              </Button>
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      filters.selectedTags.includes(tag) ? "default" : "outline"
                    }
                    className="cursor-pointer hover:bg-brand-50 hover:border-brand-300 transition-colors"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        selectedTags: prev.selectedTags.includes(tag)
                          ? prev.selectedTags.filter((t) => t !== tag)
                          : [...prev.selectedTags, tag],
                      }))
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="lg:col-span-1">
                <BlogFilters
                  posts={posts}
                  filters={filters}
                  onFiltersChange={setFilters}
                  className="sticky top-24"
                />
              </div>
            )}

            {/* Main Content */}
            <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              {filteredAndSortedPosts.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold">
                      {filters.searchTerm ||
                      filters.selectedTags.length > 0 ||
                      filters.dateRange !== "all"
                        ? `Filtered Results (${filteredAndSortedPosts.length})`
                        : "Latest Posts"}
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>
                        Sort by:{" "}
                        {
                          {
                            newest: "Newest",
                            oldest: "Oldest",
                            popular: "Popular",
                            alphabetical: "A-Z",
                          }[filters.sortBy]
                        }
                      </span>
                    </div>
                  </div>

                  <div
                    className={`grid gap-6 ${
                      showFilters
                        ? "grid-cols-1 xl:grid-cols-2"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {filteredAndSortedPosts.map((post) => (
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
                    {filters.searchTerm || filters.selectedTags.length > 0
                      ? "No posts found"
                      : "No posts yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {filters.searchTerm || filters.selectedTags.length > 0
                      ? "Try adjusting your filters or browse all posts."
                      : "Be the first to share your thoughts and create a new post."}
                  </p>
                  <div className="flex justify-center space-x-4">
                    {(filters.searchTerm ||
                      filters.selectedTags.length > 0 ||
                      filters.dateRange !== "all" ||
                      filters.sortBy !== "newest") && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          setFilters({
                            searchTerm: "",
                            selectedTags: [],
                            dateRange: "all",
                            sortBy: "newest",
                            status: "all",
                          })
                        }
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button asChild>
                      <Link to="/create">Create First Post</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
