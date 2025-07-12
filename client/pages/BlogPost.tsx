import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BlogAPI } from "@/lib/blog-api";
import { BlogPost as BlogPostType } from "@/lib/supabase";
import { DemoPostStorage } from "@/lib/demo-storage";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Tag,
  Share2,
  BookOpen,
} from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  // Sample data matching the homepage
  const samplePosts: BlogPostType[] = [
    {
      id: "1",
      title: "Getting Started with React and TypeScript",
      content: `
        <div class="prose prose-lg max-w-none">
          <p>React and TypeScript make a powerful combination for building scalable web applications. In this comprehensive guide, we'll explore how to set up a modern development environment, create type-safe components, and implement best practices for maintaining large codebases.</p>
          
          <h2>Why Choose React with TypeScript?</h2>
          <p>TypeScript brings static type checking to JavaScript, which means you can catch errors at compile time rather than runtime. When combined with React, this creates a development experience that is both productive and reliable.</p>
          
          <h3>Key Benefits:</h3>
          <ul>
            <li><strong>Type Safety:</strong> Catch errors before they reach production</li>
            <li><strong>Better IntelliSense:</strong> Enhanced autocomplete and documentation</li>
            <li><strong>Refactoring Support:</strong> Safely rename and restructure code</li>
            <li><strong>Team Collaboration:</strong> Clear interfaces and contracts</li>
          </ul>
          
          <h2>Setting Up Your Development Environment</h2>
          <p>To get started with React and TypeScript, you'll need to set up your development environment. The easiest way is to use Create React App with the TypeScript template:</p>
          
          <pre><code>npx create-react-app my-app --template typescript
cd my-app
npm start</code></pre>
          
          <h2>Creating Type-Safe Components</h2>
          <p>One of the biggest advantages of using TypeScript with React is the ability to create strongly typed components. Here's an example of a simple button component:</p>
          
          <pre><code>interface ButtonProps {
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
    &lt;button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
      disabled={disabled}
    &gt;
      {children}
    &lt;/button&gt;
  );
};</code></pre>
          
          <h2>Best Practices</h2>
          <p>When working with React and TypeScript, there are several best practices to keep in mind:</p>
          
          <ol>
            <li><strong>Use Interface over Type:</strong> Prefer interfaces for object shapes as they're more extensible</li>
            <li><strong>Leverage Union Types:</strong> Use union types for props that can accept multiple specific values</li>
            <li><strong>Generic Components:</strong> Create reusable components with generic type parameters</li>
            <li><strong>Strict Mode:</strong> Enable strict mode in your TypeScript configuration</li>
          </ol>
          
          <h2>Conclusion</h2>
          <p>React and TypeScript together provide a robust foundation for building modern web applications. The initial learning curve is worth the long-term benefits of type safety, better tooling, and improved developer experience.</p>
          
          <p>Whether you're building a small project or a large-scale application, TypeScript will help you write more maintainable and reliable code. Start with simple components and gradually adopt more advanced TypeScript features as you become comfortable with the basics.</p>
        </div>
      `,
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
      content: `
        <div class="prose prose-lg max-w-none">
          <p>CSS has evolved tremendously in recent years, bringing us powerful new features that revolutionize how we approach web design and development. From Container Queries to CSS Grid subgrid, and advanced color functions, the modern CSS landscape offers tools that were once impossible or required complex JavaScript solutions.</p>
          
          <h2>Container Queries: The Game Changer</h2>
          <p>Container Queries represent one of the most significant additions to CSS in recent years. Unlike media queries that respond to viewport size, container queries allow elements to respond to their container's size.</p>
          
          <pre><code>.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}</code></pre>
          
          <h2>CSS Grid Subgrid</h2>
          <p>Subgrid allows grid items to participate in the sizing of their parent grid, solving many complex layout challenges that previously required workarounds.</p>
          
          <pre><code>.parent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.child-grid {
  display: grid;
  grid-column: span 2;
  grid-template-columns: subgrid;
}</code></pre>
          
          <h2>Advanced Color Functions</h2>
          <p>CSS now supports sophisticated color manipulation functions that rival what we previously needed preprocessors for:</p>
          
          <ul>
            <li><code>color-mix()</code> - Blend colors together</li>
            <li><code>oklch()</code> - Perceptually uniform color space</li>
            <li><code>relative colors</code> - Modify existing colors</li>
          </ul>
          
          <pre><code>/* Color mixing */
.element {
  background: color-mix(in srgb, blue 70%, white);
}

/* Relative colors */
.variant {
  --base-color: oklch(70% 0.15 180);
  background: oklch(from var(--base-color) calc(l + 0.2) c h);
}</code></pre>
          
          <h2>CSS Cascade Layers</h2>
          <p>Cascade layers provide explicit control over the cascade, making it easier to manage styles in large applications:</p>
          
          <pre><code>@layer base, components, utilities;

@layer base {
  h1 { font-size: 2rem; }
}

@layer components {
  .btn { padding: 0.5rem 1rem; }
}</code></pre>
          
          <h2>Modern Layout Techniques</h2>
          <p>Combining these new features opens up possibilities for more sophisticated and maintainable layouts:</p>
          
          <h3>Intrinsic Web Design</h3>
          <p>Move beyond fixed breakpoints to truly responsive design that adapts to content and context.</p>
          
          <h3>Component-Driven Styling</h3>
          <p>Use container queries and cascade layers to create truly encapsulated components.</p>
          
          <h2>Browser Support and Progressive Enhancement</h2>
          <p>While these features are cutting-edge, most have excellent browser support. Use feature queries to provide fallbacks:</p>
          
                    <pre><code>@supports (container-type: inline-size) {
  .responsive-component {
    container-type: inline-size;
  }
}

@supports not (container-type: inline-size) {
  .responsive-component {
    width: 100%;
  }
}</code></pre>
          
          <h2>Getting Started</h2>
          <p>Start experimenting with these features in your projects. Begin with container queries for responsive components, then explore subgrid for complex layouts, and finally dive into the new color functions for more sophisticated theming.</p>
          
          <p>The future of CSS is incredibly exciting, and these features are just the beginning. As browser support continues to improve and new specifications are developed, we'll have even more powerful tools at our disposal.</p>
        </div>
      `,
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
      content: `
        <div class="prose prose-lg max-w-none">
          <p>Creating robust and scalable APIs is crucial for modern web applications. As applications grow and user bases expand, your API needs to handle increased traffic, maintain performance, and provide reliable service. This comprehensive guide will walk you through building production-ready APIs using Node.js and Express.</p>
          
          <h2>Setting Up the Foundation</h2>
          <p>A scalable API starts with a solid foundation. Let's begin with the essential setup:</p>
          
          <pre><code>// package.json dependencies
{
  "dependencies": {
    "express": "^4.18.0",
    "helmet": "^6.0.0",
    "cors": "^2.8.5",
    "compression": "^1.7.4",
    "express-rate-limit": "^6.7.0",
    "joi": "^17.8.0"
  }
}</code></pre>
          
          <h2>API Architecture Principles</h2>
          <p>Before diving into code, it's important to understand the architectural principles that make APIs scalable:</p>
          
          <h3>1. Separation of Concerns</h3>
          <ul>
            <li><strong>Controllers:</strong> Handle HTTP requests and responses</li>
            <li><strong>Services:</strong> Contain business logic</li>
            <li><strong>Models:</strong> Data layer and database interactions</li>
            <li><strong>Middleware:</strong> Cross-cutting concerns like authentication</li>
          </ul>
          
          <h3>2. Stateless Design</h3>
          <p>Each request should contain all the information needed to process it. This enables horizontal scaling and improves reliability.</p>
          
          <h2>Express Server Setup</h2>
          <p>Here's a robust Express server setup with essential middleware:</p>
          
          <pre><code>const express = require('express');
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
app.use('/api/', limiter);</code></pre>
          
          <h2>Error Handling Strategy</h2>
          <p>Comprehensive error handling is crucial for API reliability:</p>
          
          <pre><code>// Custom error class
class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};</code></pre>
          
          <h2>Authentication and Authorization</h2>
          <p>Implement robust security with JWT and role-based access control:</p>
          
          <pre><code>const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};</code></pre>
          
          <h2>Input Validation</h2>
          <p>Validate all incoming data to prevent security vulnerabilities and ensure data integrity:</p>
          
          <pre><code>const Joi = require('joi');

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(50).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details 
    });
  }
  next();
};</code></pre>
          
          <h2>Database Optimization</h2>
          <p>Database performance is critical for API scalability:</p>
          
          <h3>Connection Pooling</h3>
          <pre><code>// Using connection pooling with PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // maximum number of connections
  min: 5,  // minimum number of connections
});</code></pre>
          
          <h3>Query Optimization</h3>
          <ul>
            <li>Use indexes strategically</li>
            <li>Implement pagination for large datasets</li>
            <li>Use query result caching where appropriate</li>
            <li>Optimize N+1 query problems</li>
          </ul>
          
          <h2>Caching Strategies</h2>
          <p>Implement multiple levels of caching to improve performance:</p>
          
          <pre><code>const redis = require('redis');
const client = redis.createClient();

// Cache middleware
const cache = (duration = 300) => {
  return async (req, res, next) => {
    const key = \`cache:\${req.originalUrl}\`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Store original send function
      const originalSend = res.json;
      
      // Override send to cache response
      res.json = function(data) {
        client.setex(key, duration, JSON.stringify(data));
        originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};</code></pre>
          
          <h2>Testing Strategy</h2>
          <p>Comprehensive testing ensures API reliability:</p>
          
          <pre><code>// Unit test example with Jest
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  test('POST /api/users should create user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);
      
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.password).toBeUndefined();
  });
});</code></pre>
          
          <h2>Monitoring and Logging</h2>
          <p>Implement comprehensive monitoring to track API health and performance:</p>
          
          <pre><code>const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};</code></pre>
          
          <h2>Deployment and Scaling</h2>
          <p>Deploy your API with scalability in mind:</p>
          
          <h3>Horizontal Scaling</h3>
          <ul>
            <li>Use load balancers to distribute traffic</li>
            <li>Implement health check endpoints</li>
            <li>Design for stateless operation</li>
            <li>Use container orchestration (Docker + Kubernetes)</li>
          </ul>
          
          <h3>Performance Monitoring</h3>
          <ul>
            <li>Set up APM tools (New Relic, Datadog)</li>
            <li>Monitor key metrics (response time, error rate, throughput)</li>
            <li>Implement alerting for critical issues</li>
            <li>Regular performance testing</li>
          </ul>
          
          <h2>Conclusion</h2>
          <p>Building scalable APIs requires careful attention to architecture, security, performance, and monitoring. Start with these fundamentals and iterate based on your specific requirements and performance metrics.</p>
          
          <p>Remember that scalability is not just about handling more requests—it's about maintaining performance, reliability, and maintainability as your application grows. Invest time in proper testing, monitoring, and documentation to ensure your API can evolve with your needs.</p>
        </div>
      `,
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

  const loadPost = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const data = await BlogAPI.getPostBySlug(slug);

      if (data) {
        // Use real Supabase data
        setPost(data);
      } else {
        // Try to find in demo storage first (for newly created posts)
        const demoPost = DemoPostStorage.getDemoPostBySlug(slug);
        if (demoPost) {
          setPost(demoPost);
          toast({
            title: "Demo Post",
            description:
              "Viewing locally created post. Deploy to Netlify to persist posts.",
            variant: "default",
          });
        } else {
          // Fall back to sample data
          const samplePost = samplePosts.find((p) => p.slug === slug);
          if (samplePost) {
            setPost(samplePost);
            if (!BlogAPI.isSupabaseConfigured()) {
              toast({
                title: "Demo Mode",
                description:
                  "Connect to Supabase through MCP Servers to manage real blog posts. Currently showing sample data.",
                variant: "default",
              });
            }
          } else {
            setNotFound(true);
          }
        }
      }
    } catch (error) {
      console.error(
        "Unexpected error loading post:",
        error instanceof Error ? error.message : String(error),
      );
      // Try demo storage first, then sample data as fallback
      const demoPost = DemoPostStorage.getDemoPostBySlug(slug);
      if (demoPost) {
        setPost(demoPost);
        toast({
          title: "Demo Post",
          description:
            "Viewing locally created post. Deploy to Netlify to persist posts.",
          variant: "default",
        });
      } else {
        const samplePost = samplePosts.find((p) => p.slug === slug);
        if (samplePost) {
          setPost(samplePost);
          toast({
            title: "Using Demo Data",
            description:
              "Unable to load post from database. Currently showing sample data.",
            variant: "default",
          });
        } else {
          setNotFound(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;

    try {
      await BlogAPI.deletePost(post.id);
      toast({
        title: "Post Deleted",
        description: "The blog post has been successfully deleted.",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const readingTime = Math.ceil((post?.content?.length || 0) / 1000);

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
            <BookOpen className="h-12 w-12 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/20 to-blue-50/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
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

        {/* Article Header */}
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-xl">
          <CardHeader className="pb-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/edit/${post.slug}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
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
            <div
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Back to Posts */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Posts</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
