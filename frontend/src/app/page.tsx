'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Blog } from '@/types';
import { blogsAPI } from '@/services/api';
import { format } from 'date-fns';
import { Calendar, User, Eye } from 'lucide-react';

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogsAPI.getAll();
        setBlogs(data);
      } catch (err) {
        setError('Failed to load blogs');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to BlogSite
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing stories, insights, and thoughts from our community of writers. 
          Share your own stories and connect with readers around the world.
        </p>
      </div>

      {/* Blogs Grid */}
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">No blogs yet</h2>
          <p className="text-gray-600 mb-6">Be the first to share your story with the world!</p>
          <Link 
            href="/register" 
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article 
              key={blog.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  <Link 
                    href={`/blog/${blog.id}`} 
                    className="hover:text-blue-600 transition-colors"
                  >
                    {blog.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.summary || blog.content.substring(0, 150) + '...'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{blog.username}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/blog/${blog.id}`}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Read</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* CTA Section */}
      {blogs.length > 0 && (
        <div className="text-center mt-16 bg-gray-100 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to share your story?
          </h2>
          <p className="text-gray-600 mb-6">
            Join our community of writers and start sharing your thoughts with the world.
          </p>
          <Link 
            href="/register" 
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors mr-4"
          >
            Join Now
          </Link>
          <Link 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Already have an account? Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
