export type Blog = {
  _id: string;
  title: string;
  image?: string;
  publishedAt: string;
  category?: { _id: string; title: string };
  description: string;
  slug: { current: string };
};

export type BlogCategory = {
  _id: string;
  title: string;
};
