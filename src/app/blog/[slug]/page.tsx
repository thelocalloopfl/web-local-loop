import { fetchBlogs } from '../../../lib/fetchBlogs';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const allBlogs = await fetchBlogs();
  const blog = allBlogs.find(b => b.slug?.current === params.slug);

  if (!blog) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Link href="/" className="text-[#f18d2b] hover:underline text-sm mb-6 inline-block">&larr; Back to Home</Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
      <div className="flex flex-wrap gap-2 mb-3">
        {blog.category && (
          <span className="text-xs py-1" style={{ color: '#f18d2b' }}>{blog.category.title}</span>
        )}
        <span className="text-xs text-gray-500 ml-2">
          {new Date(blog.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </span>
      </div>
      {blog.image && (
        <div className="mb-6">
          <Image src={blog.image} alt={blog.title} width={800} height={400} className="w-full h-64 object-cover rounded" />
        </div>
      )}
      <div className="prose max-w-none text-gray-800">
        <p>{blog.description}</p>
      </div>
    </div>
  );
}
