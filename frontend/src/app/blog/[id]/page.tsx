'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Blog } from '@/types';
import { blogsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Calendar, User, ArrowLeft, Edit, Trash2 } from 'lucide-react';

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const blogId = params.id as string;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogsAPI.getById(parseInt(blogId));
        setBlog(data);
      } catch (err) {
        setError('Blog not found');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const handleDelete = async () => {
    if (!blog || !confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    setDeleting(true);
    try {
      await blogsAPI.delete(blog.id);
      router.push('/dashboard');
    } catch (err) {
      alert('Failed to delete blog');
      console.error('Error deleting blog:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The blog you are looking for does not exist.'}</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && user.userId === blog.userId;
  const isAdmin = user && user.role === 1; // Admin role

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to blogs
        </Link>
      </div>

      {/* Blog Header */}
      <header className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {blog.title}
          </h1>
          
          {(isOwner || isAdmin) && (
            <div className="flex space-x-2 ml-4">
              {isOwner && (
                <Link
                  href={`/edit-blog/${blog.id}`}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              )}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                ) : (
                  <Trash2 className="h-4 w-4 mr-1" />
                )}
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Blog Meta */}
        <div className="flex items-center text-gray-600 text-sm space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>By {blog.username}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
          </div>
          {blog.updatedAt !== blog.createdAt && (
            <div className="text-gray-500">
              • Updated {format(new Date(blog.updatedAt), 'MMM d, yyyy')}
            </div>
          )}
        </div>

        {/* Summary */}
        {blog.summary && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 italic">{blog.summary}</p>
          </div>
        )}
      </header>

      {/* Blog Content */}
      <article className="prose prose-lg max-w-none">
        <div className="bg-white">
          {blog.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Thank you for reading! If you enjoyed this blog, explore more stories from our community.
          </p>
          <div className="space-x-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              More Blogs
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href={`/blogs/user/${blog.userId}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              More from {blog.username}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}