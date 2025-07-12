import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogAPI } from "@/lib/blog-api";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  X,
  FileText,
  Tag,
  Calendar,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: "draft" | "published";
}

export default function CreatePost() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    excerpt: "",
    tags: [],
    status: "draft",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 50) {
      newErrors.content = "Content must be at least 50 characters";
    }

    if (formData.excerpt && formData.excerpt.length > 300) {
      newErrors.excerpt = "Excerpt must be less than 300 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    if (
      newTag.trim() &&
      !formData.tags.includes(newTag.trim()) &&
      formData.tags.length < 10
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const generateExcerpt = () => {
    if (!formData.excerpt && formData.content) {
      const generatedExcerpt = BlogAPI.generateExcerpt(formData.content, 150);
      setFormData((prev) => ({ ...prev, excerpt: generatedExcerpt }));
    }
  };

  const handleSubmit = async (status: "draft" | "published") => {
    const updatedFormData = { ...formData, status };
    setFormData(updatedFormData);

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Using Netlify Functions - no need for configuration check

    try {
      setIsSubmitting(true);

      const slug = BlogAPI.generateSlug(updatedFormData.title);
      const excerpt =
        updatedFormData.excerpt ||
        BlogAPI.generateExcerpt(updatedFormData.content);

      const newPost = {
        title: updatedFormData.title,
        content: updatedFormData.content,
        excerpt,
        tags: updatedFormData.tags,
        slug,
        status,
      };

      const createdPost = await BlogAPI.createPost(newPost);

      toast({
        title: "Post Created",
        description:
          import.meta.env.MODE === "development"
            ? `Demo: Your blog post has been ${status === "published" ? "published" : "saved as draft"} locally. Deploy to Netlify to persist posts.`
            : `Your blog post has been ${status === "published" ? "published" : "saved as draft"} successfully.`,
      });

      navigate(`/post/${slug}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = formData.content
    .replace(/<[^>]*>/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const readingTime = Math.ceil(wordCount / 200);

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/20 to-blue-50/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="mb-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setIsPreview(false)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Edit</span>
            </Button>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg mr-4">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  {import.meta.env.MODE === "development"
                    ? "Development Mode - Deploy to Netlify for full functionality"
                    : "Powered by Netlify Functions"}
                </span>
              </div>
              <Button
                onClick={() => handleSubmit("draft")}
                variant="outline"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {BlogAPI.isSupabaseConfigured()
                  ? "Save Draft"
                  : "Preview Draft"}
              </Button>
              <Button
                onClick={() => handleSubmit("published")}
                disabled={isSubmitting}
              >
                {BlogAPI.isSupabaseConfigured()
                  ? "Publish Post"
                  : "Preview Published"}
              </Button>
            </div>
          </div>

          <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-xl">
            <CardHeader className="pb-6">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
                {formData.title || "Untitled Post"}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{wordCount} words</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-brand-50 text-brand-700 border-brand-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>

            <Separator />

            <CardContent className="pt-8">
              <div
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {formData.content || "No content yet..."}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-blue-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
                Create New Post
              </h1>
              <p className="text-muted-foreground mt-2">
                Share your thoughts with the world
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsPreview(true)}
                disabled={!formData.title && !formData.content}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter a compelling title..."
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">
                    Content <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog post content here... You can use Markdown formatting."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    className={`min-h-[400px] font-mono ${errors.content ? "border-destructive" : ""}`}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">{errors.content}</p>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {wordCount} words • {readingTime} min read
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={generateExcerpt}
                      disabled={!formData.content}
                    >
                      Auto-generate
                    </Button>
                  </div>
                  <Textarea
                    id="excerpt"
                    placeholder="Optional: Write a brief excerpt that will appear in the post preview..."
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    className={`min-h-[100px] ${errors.excerpt ? "border-destructive" : ""}`}
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-destructive">{errors.excerpt}</p>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {formData.excerpt.length}/300 characters
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!newTag.trim() || formData.tags.length >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  {formData.tags.length}/10 tags used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`p-3 rounded-lg ${
                    import.meta.env.MODE === "development"
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-green-50 border border-green-200"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <FileText
                      className={`h-4 w-4 mt-0.5 ${
                        import.meta.env.MODE === "development"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    />
                    <div className="text-sm">
                      <p
                        className={`font-medium mb-1 ${
                          import.meta.env.MODE === "development"
                            ? "text-blue-800"
                            : "text-green-800"
                        }`}
                      >
                        {import.meta.env.MODE === "development"
                          ? "Development Mode"
                          : "Netlify Backend"}
                      </p>
                      <p
                        className={
                          import.meta.env.MODE === "development"
                            ? "text-blue-700"
                            : "text-green-700"
                        }
                      >
                        {import.meta.env.MODE === "development"
                          ? "Your blog is ready for Netlify! You can create and preview posts locally. Deploy to enable persistent storage."
                          : "Your blog is powered by Netlify Functions and Blob storage. Posts will be saved to your Netlify deployment."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => handleSubmit("published")}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Publishing..." : "Publish Post"}
                  </Button>
                  <Button
                    onClick={() => handleSubmit("draft")}
                    variant="outline"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save as Draft"}
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Will be published on: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
