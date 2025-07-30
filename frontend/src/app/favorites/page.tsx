'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Blog } from '@/types';
import { favoritesAPI } from '@/services/api';
import { format } from 'date-fns';
import { Calendar, User, Eye, Heart, ArrowLeft } from 'lucide-react';

export default function FavoritesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const data = await favoritesAPI.getMyFavorites();
        setFavorites(data);
      } catch (err) {
        setError('Failed to load your favorites');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, router]);

  const handleRemoveFromFavorites = async (blogId: number) => {
    try {
      await favoritesAPI.removeFromFavorites(blogId);
      setFavorites(favorites.filter(blog => blog.id !== blogId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      alert('Failed to remove from favorites');
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
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Stories</span>
        </Link>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-white fill-current" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-red-800 bg-clip-text text-transparent mb-4">
            My Favorites
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your saved stories that you can revisit anytime ❤️
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-white to-red-50 rounded-xl shadow-lg border border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No favorites yet</h2>
            <p className="text-gray-600 mb-8 text-lg">Start exploring and save stories you love!</p>
            <Link 
              href="/"
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Discover Stories
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((blog) => (
            <article 
              key={blog.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
                    <Link 
                      href={`/blog/${blog.id}`} 
                      className="hover:text-blue-600 transition-colors"
                    >
                      {blog.title}
                    </Link>
                  </h2>
                  <button
                    onClick={() => handleRemoveFromFavorites(blog.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 ml-2"
                    title="Remove from favorites"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {blog.summary || blog.content.substring(0, 150) + '...'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
      {favorites.length > 0 && (
        <section className="mt-20">
          <div className="relative bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-12 shadow-xl border border-gray-100 overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Want to discover more?
              </h2>
              <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                Explore more amazing stories from our community of writers.
              </p>
              <Link 
                href="/"
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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