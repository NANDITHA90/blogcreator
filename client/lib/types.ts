export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  author: string;
  tags: string[];
}