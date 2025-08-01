export type Spotlight = {
  _id: string;
  title: string;
  image?: string;
  description: string;
  offerText?: string;
  websiteUrl: string;
  category?: { _id: string; title: string };
};

export type SpotlightCategory = {
  _id: string;
  title: string;
};
