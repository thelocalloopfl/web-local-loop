import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './sanity';

type SanityImageSource = {
  asset: {
    _ref: string;
    _type: string;
  };
};

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
