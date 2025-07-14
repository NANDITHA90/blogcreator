import { useEffect, useState } from "react";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogAPI } from "@/lib/blog-api";
import { Post } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  BookOpen,
  TrendingUp,
  Users,
  Globe,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedTags]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await BlogAPI.getAllPosts();
      setPosts(data);
      toast({
        title: "Posts Loaded",
        description: `Found ${data.length} posts from the community`,
      });
    } catch (error) {
      console.error("Error loading posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.author.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag)),
      );
    }

    // Sort by newest first
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    setFilteredPosts(filtered);
  };

  const handleDeletePost = async (id: string) => {
    try {
      await BlogAPI.deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
      toast({
        title: "Post Deleted",
        description: "The post has been successfully deleted.",
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

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).slice(
    0,
    12,
  );

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

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
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 bg-clip-text text-transparent">
              CollabBlog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A collaborative platform where everyone can share ideas, stories, and knowledge. 
              Write, discover, and connect with a global community of writers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600"
            >
              <Link to="/create" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Share Your Story</span>
              </Link>
            </Button>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{posts.length} Posts</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>Global Community</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-4 w-4" />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>

          {/* Search and Tags */}
          <div className="max-w-2xl mx-auto space-y-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search posts, authors, or topics..."
            />

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-brand-50 hover:border-brand-300 transition-colors"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {selectedTags.length > 0 && (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    className="cursor-pointer"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {filteredPosts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">
                  {searchTerm || selectedTags.length > 0
                    ? `Search Results (${filteredPosts.length})`
                    : "Latest Posts"}
                </h2>
                <Button
                  variant="outline"
                  onClick={loadPosts}
                  className="flex items-center space-x-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <PostCard
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
                {searchTerm || selectedTags.length > 0
                  ? "No posts found"
                  : "No posts yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedTags.length > 0
                  ? "Try adjusting your search or browse all posts."
                  : "Be the first to share your thoughts with the community."}
              </p>
              <div className="flex justify-center space-x-4">
                {(searchTerm || selectedTags.length > 0) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTags([]);
                    }}
                  >
                    Clear Search
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