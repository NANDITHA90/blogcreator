import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogAPI } from "@/lib/blog-api";
import { BlogPost } from "@/lib/supabase";
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
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: "draft" | "published";
}

export default function EditPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

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

  // Sample posts data for demo (same as in BlogPost.tsx)
  const samplePosts: BlogPost[] = [
    {
      id: "1",
      title: "Getting Started with React and TypeScript",
      content: `React and TypeScript make a powerful combination for building scalable web applications. In this comprehensive guide, we'll explore how to set up a modern development environment, create type-safe components, and implement best practices for maintaining large codebases.

## Why Choose React with TypeScript?

TypeScript brings static type checking to JavaScript, which means you can catch errors at compile time rather than runtime. When combined with React, this creates a development experience that is both productive and reliable.

### Key Benefits:
- **Type Safety:** Catch errors before they reach production
- **Better IntelliSense:** Enhanced autocomplete and documentation
- **Refactoring Support:** Safely rename and restructure code
- **Team Collaboration:** Clear interfaces and contracts

## Setting Up Your Development Environment

To get started with React and TypeScript, you'll need to set up your development environment. The easiest way is to use Create React App with the TypeScript template:

\`\`\`bash
npx create-react-app my-app --template typescript
cd my-app
npm start
\`\`\`

## Creating Type-Safe Components

One of the biggest advantages of using TypeScript with React is the ability to create strongly typed components. Here's an example of a simple button component:

\`\`\`typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false 
}) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
\`\`\`

## Best Practices

When working with React and TypeScript, there are several best practices to keep in mind:

1. **Use Interface over Type:** Prefer interfaces for object shapes as they're more extensible
2. **Leverage Union Types:** Use union types for props that can accept multiple specific values
3. **Generic Components:** Create reusable components with generic type parameters
4. **Strict Mode:** Enable strict mode in your TypeScript configuration

## Conclusion

React and TypeScript together provide a robust foundation for building modern web applications. The initial learning curve is worth the long-term benefits of type safety, better tooling, and improved developer experience.

Whether you're building a small project or a large-scale application, TypeScript will help you write more maintainable and reliable code. Start with simple components and gradually adopt more advanced TypeScript features as you become comfortable with the basics.`,
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
      content: `CSS has evolved tremendously in recent years, bringing us powerful new features that revolutionize how we approach web design and development. From Container Queries to CSS Grid subgrid, and advanced color functions, the modern CSS landscape offers tools that were once impossible or required complex JavaScript solutions.

## Container Queries: The Game Changer

Container Queries represent one of the most significant additions to CSS in recent years. Unlike media queries that respond to viewport size, container queries allow elements to respond to their container's size.

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
\`\`\`

## CSS Grid Subgrid

Subgrid allows grid items to participate in the sizing of their parent grid, solving many complex layout challenges that previously required workarounds.

\`\`\`css
.parent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.child-grid {
  display: grid;
  grid-column: span 2;
  grid-template-columns: subgrid;
}
\`\`\`

## Advanced Color Functions

CSS now supports sophisticated color manipulation functions that rival what we previously needed preprocessors for:

- \`color-mix()\` - Blend colors together
- \`oklch()\` - Perceptually uniform color space
- \`relative colors\` - Modify existing colors

\`\`\`css
/* Color mixing */
.element {
  background: color-mix(in srgb, blue 70%, white);
}

/* Relative colors */
.variant {
  --base-color: oklch(70% 0.15 180);
  background: oklch(from var(--base-color) calc(l + 0.2) c h);
}
\`\`\`

## Getting Started

Start experimenting with these features in your projects. Begin with container queries for responsive components, then explore subgrid for complex layouts, and finally dive into the new color functions for more sophisticated theming.

The future of CSS is incredibly exciting, and these features are just the beginning!`,
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
      content: `Creating robust and scalable APIs is crucial for modern web applications. As applications grow and user bases expand, your API needs to handle increased traffic, maintain performance, and provide reliable service. This comprehensive guide will walk you through building production-ready APIs using Node.js and Express.

## Setting Up the Foundation

A scalable API starts with a solid foundation. Let's begin with the essential setup:

\`\`\`json
{
  "dependencies": {
    "express": "^4.18.0",
    "helmet": "^6.0.0",
    "cors": "^2.8.5",
    "compression": "^1.7.4",
    "express-rate-limit": "^6.7.0",
    "joi": "^17.8.0"
  }
}
\`\`\`

## API Architecture Principles

Before diving into code, it's important to understand the architectural principles that make APIs scalable:

### 1. Separation of Concerns
- **Controllers:** Handle HTTP requests and responses
- **Services:** Contain business logic
- **Models:** Data layer and database interactions
- **Middleware:** Cross-cutting concerns like authentication

### 2. Stateless Design
Each request should contain all the information needed to process it. This enables horizontal scaling and improves reliability.

## Express Server Setup

Here's a robust Express server setup with essential middleware:

\`\`\`javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Performance middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
\`\`\`

## Conclusion

Building scalable APIs requires careful attention to architecture, security, performance, and monitoring. Start with these fundamentals and iterate based on your specific requirements and performance metrics.

Remember that scalability is not just about handling more requests—it's about maintaining performance, reliability, and maintainability as your application grows.`,
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
    if (!slug) return;
    loadPost();
  }, [slug]);

  useEffect(() => {
    if (originalPost) {
      const currentData = JSON.stringify(formData);
      const originalData = JSON.stringify({
        title: originalPost.title,
        content: originalPost.content,
        excerpt: originalPost.excerpt || "",
        tags: originalPost.tags,
        status: "published", // Assuming existing posts are published
      });
      setHasChanges(currentData !== originalData);
    }
  }, [formData, originalPost]);

  const loadPost = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const data = await BlogAPI.getPostBySlug(slug);

      if (data) {
        setOriginalPost(data);
        setFormData({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || "",
          tags: data.tags,
          status: "published",
        });
      } else {
        // Try sample data
        const samplePost = samplePosts.find((p) => p.slug === slug);
        if (samplePost) {
          setOriginalPost(samplePost);
          setFormData({
            title: samplePost.title,
            content: samplePost.content,
            excerpt: samplePost.excerpt || "",
            tags: samplePost.tags,
            status: "published",
          });
          if (!BlogAPI.isSupabaseConfigured()) {
            toast({
              title: "Demo Mode",
              description:
                "Connect to Supabase to edit real posts. Currently editing sample data.",
              variant: "default",
            });
          }
        } else {
          setNotFound(true);
        }
      }
    } catch (error) {
      console.error("Error loading post:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

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
    if (formData.content) {
      const generatedExcerpt = BlogAPI.generateExcerpt(formData.content, 150);
      setFormData((prev) => ({ ...prev, excerpt: generatedExcerpt }));
    }
  };

  const handleSubmit = async () => {
    if (!originalPost) return;

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Using Netlify Functions - no configuration needed

    try {
      setIsSubmitting(true);

      const excerpt =
        formData.excerpt || BlogAPI.generateExcerpt(formData.content);

      const updates = {
        title: formData.title,
        content: formData.content,
        excerpt,
        tags: formData.tags,
        slug: BlogAPI.generateSlug(formData.title),
      };

      await BlogAPI.updatePost(originalPost.id, updates);

      toast({
        title: "Post Updated",
        description:
          import.meta.env.MODE === "development"
            ? "Demo: Your blog post has been updated locally. Deploy to Netlify to persist changes."
            : "Your blog post has been updated successfully.",
      });

      navigate(`/post/${updates.slug}`);
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update post. Please try again.",
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

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !originalPost) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-16">
          <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The blog post you're trying to edit doesn't exist or has been
            removed.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

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
              {!BlogAPI.isSupabaseConfigured() && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg mr-4">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-800">
                    Demo Mode - Connect Supabase to save changes
                  </span>
                </div>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !hasChanges}
              >
                {isSubmitting
                  ? "Processing..."
                  : BlogAPI.isSupabaseConfigured()
                    ? "Save Changes"
                    : "Demo Preview"}
              </Button>
            </div>
          </div>

          <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-xl">
            <CardHeader className="pb-6">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
                {formData.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(originalPost.created_at).toLocaleDateString()}
                    </span>
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
                {formData.content}
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
            <Link
              to={`/post/${originalPost.slug}`}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Post</span>
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
                Edit Post
              </h1>
              <p className="text-muted-foreground mt-2">
                Make changes to "{originalPost.title}"
              </p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsPreview(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          {hasChanges && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  You have unsaved changes
                </span>
              </div>
            </div>
          )}
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
                    placeholder="Write your blog post content here..."
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
                    placeholder="Optional: Write a brief excerpt..."
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
                <CardTitle>Update Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasChanges && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Save className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-green-800 mb-1">
                          Ready to Save
                        </p>
                        <p className="text-green-700">
                          Your changes will be saved to Netlify Blob storage.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !hasChanges}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>

                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created:{" "}
                      {new Date(originalPost.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Updated:{" "}
                      {new Date(originalPost.updated_at).toLocaleDateString()}
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
