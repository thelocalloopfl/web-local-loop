export interface EventItem {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  publishedAt: string; // ✅ Remove optional (since it's being used without checks)
  image?: string; // image.asset.url
  categories?: {
    _id: string;
    title: string;
  }[];
}
