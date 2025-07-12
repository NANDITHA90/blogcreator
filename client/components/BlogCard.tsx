import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  Tag,
  FileText,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { BlogPost } from "@/lib/supabase";

interface BlogCardProps {
  post: BlogPost;
  onDelete: (id: string) => void;
}

export function BlogCard({ post, onDelete }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const readingTime = Math.ceil((post.content?.length || 0) / 1000);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-semibold group-hover:text-brand-600 transition-colors line-clamp-2 flex-1">
                <Link to={`/post/${post.slug}`}>{post.title}</Link>
              </h3>
              {post.status === "draft" && (
                <Badge
                  variant="outline"
                  className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Draft
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{readingTime} min read</span>
              </div>
              {post.status === "published" && (
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>Published</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" asChild>
              <Link to={`/edit/${post.slug}`}>
                <Edit className="h-3 w-3" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(post.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
          {post.excerpt ||
            post.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "..."}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
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

      <CardFooter className="pt-0">
        <Button asChild className="w-full" variant="outline">
          <Link to={`/post/${post.slug}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
