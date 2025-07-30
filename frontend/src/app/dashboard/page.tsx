'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Blog } from '@/types';
import { blogsAPI } from '@/services/api';
import { format } from 'date-fns';
import { Calendar, Edit, Trash2, PlusCircle, Eye } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchMyBlogs = async () => {
      try {
        const data = await blogsAPI.getMy();
        setBlogs(data);
      } catch (err) {
        setError('Failed to load your blogs');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [user, router]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    setDeletingId(id);
    try {
      await blogsAPI.delete(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (err) {
      alert('Failed to delete blog');
      console.error('Error deleting blog:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user.username}!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Blogs</h3>
          <p className="text-3xl font-bold text-blue-600">{blogs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Published</h3>
          <p className="text-3xl font-bold text-green-600">{blogs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Views</h3>
          <p className="text-3xl font-bold text-purple-600">-</p>
          <p className="text-sm text-gray-500 mt-1">Coming soon</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Blogs</h2>
        <Link
          href="/create-blog"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
        >
          <PlusCircle className="h-5 w-5" />
          <span>New Blog</span>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Blogs List */}
      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">No blogs yet</h3>
          <p className="text-gray-600 mb-6">Start sharing your thoughts with the world!</p>
          <Link
            href="/create-blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <li key={blog.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {blog.title}
                      </h3>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/blog/${blog.id}`}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View blog"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/edit-blog/${blog.id}`}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Edit blog"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          disabled={deletingId === blog.id}
                          className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                          title="Delete blog"
                        >
                          {deletingId === blog.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {blog.summary || blog.content.substring(0, 200) + '...'}
                    </p>
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Created {format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                      {blog.updatedAt !== blog.createdAt && (
                        <span className="ml-3">
                          • Updated {format(new Date(blog.updatedAt), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}