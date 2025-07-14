import {
  Calendar,
  User,
  Tag,
  Trash2,
  Eye,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/post/${post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold group-hover:text-brand-600 transition-colors line-clamp-2 mb-2">
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button size="sm" variant="ghost" onClick={handleShare}>
              <Share2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(post.id);
              }}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-3">
          {post.content.length > 150 
            ? post.content.slice(0, 150) + "..." 
            : post.content}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100"
              >
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex-shrink-0">
        <Button asChild className="w-full" variant="outline">
          <Link to={`/post/${post.id}`} className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Read More</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}