'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Blog } from '@/types';
import { blogsAPI } from '@/services/api';
import { format } from 'date-fns';
import { Calendar, User, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import FavoriteButton from '@/components/FavoriteButton';

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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
      <div className="text-center mb-16">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
            {user ? `Welcome back, ${user.username}!` : "Welcome to BlogSite"}
          </h1>
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          {user 
            ? "Ready to share another story? Continue your writing journey and inspire readers around the world. ✨"
            : "Discover amazing stories, insights, and thoughts from our community of writers. Share your own stories and connect with readers around the world. ✨"
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href={user ? "/create-blog" : "/register"} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {user ? "Start Writing" : "Start Writing Today"}
          </Link>
          <Link 
            href="#blogs" 
            className="text-gray-600 hover:text-gray-800 px-8 py-4 rounded-xl text-lg font-medium transition-colors border border-gray-300 hover:border-gray-400"
          >
            Explore Stories
          </Link>
        </div>
      </div>

      {/* Blogs Grid */}
      <section id="blogs">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Latest Stories
        </h2>
        {blogs.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">📝</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No blogs yet</h2>
              <p className="text-gray-600 mb-8 text-lg">Be the first to share your story with the world!</p>
              <Link 
                href={user ? "/create-blog" : "/register"} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {user ? "Start Writing" : "Get Started"}
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
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-medium">{blog.username}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                      </div>
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
      </section>

      {/* CTA Section */}
      {blogs.length > 0 && (
        <section className="mt-20">
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 shadow-xl border border-gray-100 overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Ready to share your story?
              </h2>
              <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                Join our community of writers and start sharing your thoughts with the world. 
                Your voice matters, and your stories deserve to be heard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href={user ? "/create-blog" : "/register"} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {user ? "Start Writing" : "Join Now"}
                </Link>
                {!user && (
                  <Link 
                    href="/login" 
                    className="text-gray-600 hover:text-gray-800 px-8 py-4 rounded-xl text-lg font-medium transition-colors"
                  >
                    Already have an account? Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
