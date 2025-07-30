'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Blog } from '@/types';
import { blogsAPI } from '@/services/api';
import { format } from 'date-fns';
import { Calendar, User, Eye, ArrowLeft } from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';

export default function UserBlogsPage() {
  const params = useParams();
  const userId = parseInt(params.id as string);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const data = await blogsAPI.getByUser(userId);
        setBlogs(data);
        if (data.length > 0) {
          setUserName(data[0].username);
        }
      } catch (err) {
        setError('Failed to load blogs');
        console.error('Error fetching user blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserBlogs();
    }
  }, [userId]);

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
          <Link 
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Stories</span>
        </Link>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Stories by {userName}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover all the amazing stories and insights shared by {userName}
          </p>
        </div>
      </div>

      {/* Blogs Grid */}
      {blogs.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No stories yet</h2>
            <p className="text-gray-600 mb-8 text-lg">This author hasn't shared any stories yet.</p>
            <Link 
              href="/"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore Other Stories
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article 
              key={blog.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  <Link 
                    href={`/blog/${blog.id}`} 
                    className="hover:text-blue-600 transition-colors"
                  >
                    {blog.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {blog.summary || blog.content.substring(0, 150) + '...'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <FavoriteButton 
                    blogId={blog.id} 
                    isFavorited={blog.isFavorited} 
                    size="sm"
                  />
                </div>
                
                <div className="mt-4">
                  <Link 
                    href={`/blog/${blog.id}`}
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Read Story</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Footer CTA */}
      {blogs.length > 0 && (
        <section className="mt-20">
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 shadow-xl border border-gray-100 overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Enjoyed {userName}'s stories?
              </h2>
              <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                Discover more amazing content from our community of writers.
              </p>
              <Link 
                href="/"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Explore All Stories
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}