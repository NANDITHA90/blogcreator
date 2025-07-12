# QuickBlog Database Setup & Schema

This document provides comprehensive instructions for setting up the Supabase database for the QuickBlog application.

## Quick Setup

1. **Connect to Supabase**: Click the "MCP Servers" button in the chat interface and connect to Supabase
2. **Create the database table** using the SQL commands below
3. **Set environment variables** in your project
4. **Test the connection** by creating your first blog post

## Database Schema

### Blog Posts Table

The core table for storing blog posts with full metadata and content.

```sql
-- Create the blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Table Structure

| Column       | Type                     | Description                            | Constraints                              |
| ------------ | ------------------------ | -------------------------------------- | ---------------------------------------- |
| `id`         | UUID                     | Primary key, auto-generated            | PRIMARY KEY                              |
| `title`      | VARCHAR(200)             | Blog post title                        | NOT NULL                                 |
| `slug`       | VARCHAR(250)             | URL-friendly identifier                | UNIQUE, NOT NULL                         |
| `content`    | TEXT                     | Full blog post content (Markdown/HTML) | NOT NULL                                 |
| `excerpt`    | TEXT                     | Short description/preview              | Optional                                 |
| `tags`       | TEXT[]                   | Array of tags for categorization       | Default: empty array                     |
| `status`     | VARCHAR(20)              | Publication status                     | DEFAULT 'draft', CHECK (draft/published) |
| `author_id`  | UUID                     | Reference to auth.users                | Foreign Key                              |
| `created_at` | TIMESTAMP WITH TIME ZONE | Creation timestamp                     | NOT NULL, auto-generated                 |
| `updated_at` | TIMESTAMP WITH TIME ZONE | Last update timestamp                  | NOT NULL, auto-updated                   |

## Row Level Security (RLS)

Enable RLS for secure access to blog posts:

```sql
-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for reading published posts (public access)
CREATE POLICY "Anyone can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

-- Policy for reading own posts (including drafts)
CREATE POLICY "Users can read own posts" ON blog_posts
  FOR SELECT USING (auth.uid() = author_id);

-- Policy for inserting posts
CREATE POLICY "Users can insert own posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Policy for updating own posts
CREATE POLICY "Users can update own posts" ON blog_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Policy for deleting own posts
CREATE POLICY "Users can delete own posts" ON blog_posts
  FOR DELETE USING (auth.uid() = author_id);
```

## Environment Variables

Add these to your `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Sample Data

Insert sample blog posts for testing:

````sql
-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, tags, status) VALUES
(
  'Getting Started with React and TypeScript',
  'getting-started-react-typescript',
  E'# Getting Started with React and TypeScript\n\nReact and TypeScript make a powerful combination for building scalable web applications. In this comprehensive guide, we''ll explore how to set up a modern development environment, create type-safe components, and implement best practices for maintaining large codebases.\n\n## Why Choose React with TypeScript?\n\nTypeScript brings static type checking to JavaScript, which means you can catch errors at compile time rather than runtime. When combined with React, this creates a development experience that is both productive and reliable.\n\n### Key Benefits:\n- **Type Safety:** Catch errors before they reach production\n- **Better IntelliSense:** Enhanced autocomplete and documentation\n- **Refactoring Support:** Safely rename and restructure code\n- **Team Collaboration:** Clear interfaces and contracts\n\n## Setting Up Your Development Environment\n\nTo get started with React and TypeScript, you''ll need to set up your development environment. The easiest way is to use Create React App with the TypeScript template:\n\n```bash\nnpx create-react-app my-app --template typescript\ncd my-app\nnpm start\n```\n\n## Conclusion\n\nReact and TypeScript together provide a robust foundation for building modern web applications. The initial learning curve is worth the long-term benefits of type safety, better tooling, and improved developer experience.',
  'Learn how to build scalable web applications with React and TypeScript. A comprehensive guide covering setup, components, and best practices.',
  ARRAY['React', 'TypeScript', 'Web Development', 'Frontend'],
  'published'
),
(
  'Modern CSS Techniques for 2024',
  'modern-css-techniques-2024',
  E'# Modern CSS Techniques for 2024\n\nCSS has evolved tremendously in recent years, bringing us powerful new features that revolutionize how we approach web design and development. From Container Queries to CSS Grid subgrid, and advanced color functions, the modern CSS landscape offers tools that were once impossible or required complex JavaScript solutions.\n\n## Container Queries: The Game Changer\n\nContainer Queries represent one of the most significant additions to CSS in recent years. Unlike media queries that respond to viewport size, container queries allow elements to respond to their container''s size.\n\n```css\n.card-container {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .card {\n    display: grid;\n    grid-template-columns: 1fr 2fr;\n  }\n}\n```\n\n## Getting Started\n\nStart experimenting with these features in your projects. Begin with container queries for responsive components, then explore subgrid for complex layouts, and finally dive into the new color functions for more sophisticated theming.',
  'Discover the latest CSS features and techniques that will revolutionize your web design workflow in 2024.',
  ARRAY['CSS', 'Web Design', 'Frontend', 'Responsive Design'],
  'published'
),
(
  'Building Scalable APIs with Node.js',
  'building-scalable-apis-nodejs',
  E'# Building Scalable APIs with Node.js\n\nCreating robust and scalable APIs is crucial for modern web applications. As applications grow and user bases expand, your API needs to handle increased traffic, maintain performance, and provide reliable service. This comprehensive guide will walk you through building production-ready APIs using Node.js and Express.\n\n## Setting Up the Foundation\n\nA scalable API starts with a solid foundation. Let''s begin with the essential setup:\n\n```json\n{\n  "dependencies": {\n    "express": "^4.18.0",\n    "helmet": "^6.0.0",\n    "cors": "^2.8.5",\n    "compression": "^1.7.4",\n    "express-rate-limit": "^6.7.0",\n    "joi": "^17.8.0"\n  }\n}\n```\n\n## Conclusion\n\nBuilding scalable APIs requires careful attention to architecture, security, performance, and monitoring. Start with these fundamentals and iterate based on your specific requirements and performance metrics.',
  'Learn to build production-ready APIs with Node.js and Express, covering authentication, testing, and deployment.',
  ARRAY['Node.js', 'API', 'Backend', 'Express', 'JavaScript'],
  'published'
);
````

## Database Functions & Triggers

### Auto-generate Slug Function

```sql
-- Function to automatically generate slug from title
CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(
      REGEXP_REPLACE(
        REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'),
        '\s+', '-', 'g'
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE TRIGGER auto_generate_slug
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_title();
```

### Full-Text Search

```sql
-- Add full-text search capabilities
ALTER TABLE blog_posts ADD COLUMN search_vector tsvector;

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for search vector
CREATE TRIGGER update_search_vector_trigger
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();

-- Index for search
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(search_vector);

-- Update existing rows
UPDATE blog_posts SET title = title;
```

## API Usage Examples

### TypeScript Interface

```typescript
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[];
  status: "draft" | "published";
  author_id?: string;
  created_at: string;
  updated_at: string;
};
```

### Basic Queries

```typescript
// Get all published posts
const { data: posts } = await supabase
  .from("blog_posts")
  .select("*")
  .eq("status", "published")
  .order("created_at", { ascending: false });

// Get post by slug
const { data: post } = await supabase
  .from("blog_posts")
  .select("*")
  .eq("slug", "my-post-slug")
  .single();

// Create new post
const { data: newPost } = await supabase
  .from("blog_posts")
  .insert({
    title: "My New Post",
    content: "Post content here...",
    tags: ["react", "typescript"],
    status: "published",
  })
  .select()
  .single();

// Update post
const { data: updatedPost } = await supabase
  .from("blog_posts")
  .update({
    title: "Updated Title",
    content: "Updated content...",
  })
  .eq("id", postId)
  .select()
  .single();

// Delete post
const { error } = await supabase.from("blog_posts").delete().eq("id", postId);
```

## Performance Considerations

### Indexing Strategy

1. **Primary Access Patterns**: Index on `slug` for direct post access
2. **Listing Posts**: Index on `created_at DESC` for chronological listing
3. **Tag Filtering**: GIN index on `tags` array for efficient tag queries
4. **Search**: GIN index on `search_vector` for full-text search
5. **User Posts**: Index on `author_id` for user-specific queries

### Query Optimization

- Use `select()` to specify only needed columns
- Implement pagination with `range()` for large datasets
- Use `limit()` to prevent large result sets
- Consider materialized views for complex aggregations

## Backup & Migration

### Backup Strategy

```sql
-- Create backup
pg_dump -h your-host -U postgres -d your-database > backup.sql

-- Restore backup
psql -h your-host -U postgres -d your-database < backup.sql
```

### Migration Scripts

Store migration scripts in `migrations/` folder:

```sql
-- migrations/001_initial_schema.sql
-- migrations/002_add_search_functionality.sql
-- migrations/003_add_status_column.sql
```

## Monitoring & Analytics

### Useful Queries

```sql
-- Posts by status
SELECT status, COUNT(*) FROM blog_posts GROUP BY status;

-- Posts per day
SELECT DATE(created_at) as date, COUNT(*) as posts_count
FROM blog_posts
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Most popular tags
SELECT unnest(tags) as tag, COUNT(*) as count
FROM blog_posts
WHERE status = 'published'
GROUP BY tag
ORDER BY count DESC
LIMIT 10;

-- Average post length
SELECT AVG(LENGTH(content)) as avg_content_length
FROM blog_posts
WHERE status = 'published';
```

## Troubleshooting

### Common Issues

1. **RLS Policies**: Ensure RLS policies allow the intended operations
2. **UUID Generation**: Verify `gen_random_uuid()` extension is enabled
3. **Timezone**: Always use UTC timestamps for consistency
4. **Array Handling**: Use proper array syntax for tags field
5. **Trigger Issues**: Check trigger functions are properly created

### Useful Commands

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'blog_posts';

-- Check triggers
SELECT * FROM pg_trigger WHERE tgname LIKE '%blog_posts%';

-- Check indexes
SELECT * FROM pg_indexes WHERE tablename = 'blog_posts';

-- Analyze table performance
ANALYZE blog_posts;
EXPLAIN ANALYZE SELECT * FROM blog_posts WHERE status = 'published';
```

This comprehensive database setup ensures your QuickBlog application has a robust, scalable, and performant foundation for managing blog content.
