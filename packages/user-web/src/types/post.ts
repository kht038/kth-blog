export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  status: string;
  publishedAt: string;
  tags: {
    id: number;
    name: string;
    slug: string;
  };
};
