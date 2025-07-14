import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BlogAPI } from "@/lib/blog-api";
import { Post } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Share2,
  Trash2,
  Globe,
  Heart,
} from "lucide-react";

export default function PostView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    loadPost();
  }, [id]);

  const loadPost = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await BlogAPI.getPostById(id);
      if (data) {
        setPost(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error loading post:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await BlogAPI.deletePost(post.id);
      toast({
        title: "Post Deleted",
        description: "The post has been successfully deleted.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Post link has been copied to clipboard.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-16">
          <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
            <Globe className="h-12 w-12 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/20 to-purple-50/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Navigation */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Posts</span>
            </Link>
          </Button>
        </div>

        {/* Article */}
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-xl">
          <CardHeader className="pb-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span>Public</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDeletePost}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-8">
            <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Actions */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Button variant="outline" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Like this post</span>
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share with community
            </Button>
          </div>
          
          <Button asChild size="lg">
            <Link to="/create" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Share Your Own Story</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}