import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ message: 'Server configuration error: SANITY_WEBHOOK_SECRET missing' }, { status: 500 });
  }

  const body = await req.json();
  const signature = req.headers.get('sanity-webhook-signature') || '';

  const computedSignature = createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');

  if (signature !== `sha256=${computedSignature}`) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  try {
    const { _type, slug, _id } = body;
    const pathsToRevalidate: string[] = [];

    switch (_type) {
      case 'blog':
        if (_id) pathsToRevalidate.push(`/blog/${_id}`);
        pathsToRevalidate.push('/blog', '/');
        break;

      case 'blogCategory':
        pathsToRevalidate.push('/blog', '/');
        break;

      case 'bannerSection':
        pathsToRevalidate.push('/');
        break;

      case 'event':
        if (slug?.current) pathsToRevalidate.push(`/event/${slug.current}`);
        pathsToRevalidate.push('/events', '/');
        break;

      case 'eventCategory':
        pathsToRevalidate.push('/events', '/');
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
        pathsToRevalidate.push('/local-spotlight', '/');
        break;

      case 'spotlightCategory':
        pathsToRevalidate.push('/local-spotlight', '/');
        break;

      default:
        console.warn(`Unknown content type: ${_type}`);
        break;
    }

    // Revalidate paths
    // If using Vercel On-Demand Revalidation, call the revalidate API route for each path
    // Example: fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?path=${path}&secret=${secret}`)
    await Promise.all(pathsToRevalidate.map(async (path) => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/revalidate?path=${encodeURIComponent(path)}&secret=${secret}`, {
          method: 'GET',
        });
      } catch (err) {
        console.error(`Failed to revalidate ${path}`, err);
      }
    }));

    return NextResponse.json({ message: 'Revalidation triggered', paths: pathsToRevalidate });
  } catch (error) {
    console.error('Revalidation failed:', error);
    return NextResponse.json({ message: 'Revalidation failed' }, { status: 500 });
  }
}
