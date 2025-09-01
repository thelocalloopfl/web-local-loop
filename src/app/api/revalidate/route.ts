import type { NextApiRequest, NextApiResponse } from 'next';
import { createHmac } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const signature = req.headers['sanity-webhook-signature'] as string;
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'Server configuration error: SANITY_WEBHOOK_SECRET missing' });
  }

  const body = req.body;
  const computedSignature = createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');

  if (signature !== `sha256=${computedSignature}`) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  try {
    const { _type, slug, _id } = body;
    const pathsToRevalidate: string[] = [];

    switch (_type) {
      case 'blog':
        if (_id) {
          pathsToRevalidate.push(`/blog/${_id}`);
        }
        pathsToRevalidate.push('/blog');
        pathsToRevalidate.push('/');
        break;

      case 'blogCategory':
        pathsToRevalidate.push('/blog');
        pathsToRevalidate.push('/');
        break;
      
      case 'bannerSection':
        pathsToRevalidate.push('/');
        break;

      case 'event':
        if (slug?.current) {
          pathsToRevalidate.push(`/event/${slug.current}`);
        }
        pathsToRevalidate.push('/events');
        pathsToRevalidate.push('/');
        break;

      case 'eventCategory':
        pathsToRevalidate.push('/events');
        pathsToRevalidate.push('/');
        break;

      case 'directory':
      case 'directoryCategory':
        pathsToRevalidate.push('/directory');
        break;

      case 'siteLogo':
      case 'middleBanner':
      case 'sidebar':
      case 'topBanner':
        pathsToRevalidate.push(
          '/', '/newsletter', '/blog', '/local-spotlight', '/shop',
          '/advertise', '/about', '/contact', '/directory'
        );
        break;

      case 'shop':
        pathsToRevalidate.push('/shop');
        break;

      case 'spotlight':
        pathsToRevalidate.push('/local-spotlight'); // Spotlight listing
        pathsToRevalidate.push('/');                // Home (spotlight shows here)
        break;

      case 'spotlightCategory':
        pathsToRevalidate.push('/local-spotlight');
        pathsToRevalidate.push('/');
        break;

      default:
        console.warn(`Unknown content type: ${_type}`);
        break;
    }

    // Revalidate the affected paths
    if (pathsToRevalidate.length > 0) {
      await Promise.all(pathsToRevalidate.map(path => res.revalidate(path)));
    }

    return res.status(200).json({
      message: 'Revalidation triggered',
      paths: pathsToRevalidate,
    });
  } catch (error) {
    console.error('Revalidation failed:', error);
    return res.status(500).json({ message: 'Revalidation failed' });
  }
}
