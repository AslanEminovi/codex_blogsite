'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Blog } from '@/types';
import { blogsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Calendar, User, ArrowLeft, Edit, Trash2, Share2, Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-all duration-200 font-medium group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to all stories
        </Link>
      </div>

      {/* Blog Header */}
      <header className="mb-12">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex items-center space-x-2 ml-6">
              {/* Action Buttons */}
              <button
                onClick={() => navigator.share?.({ title: blog.title, url: window.location.href })}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Like"
              >
                <Heart className="h-5 w-5" />
              </button>
              
              {(isOwner || isAdmin) && (
                <div className="flex space-x-2 ml-2 border-l border-gray-300 pl-4">
                  {isOwner && (
                    <Link
                      href={`/edit-blog/${blog.id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
                  >
                    {deleting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Blog Meta */}
          <div className="flex flex-wrap items-center text-gray-600 space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">By {blog.username}</p>
                <p className="text-xs text-gray-500">Author</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</p>
                <p className="text-xs text-gray-500">Published</p>
              </div>
            </div>
            {blog.updatedAt !== blog.createdAt && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{format(new Date(blog.updatedAt), 'MMM d, yyyy')}</p>
                  <p className="text-xs text-gray-500">Updated</p>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          {blog.summary && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
              <p className="text-blue-800 text-lg italic leading-relaxed">{blog.summary}</p>
            </div>
          )}
        </div>
      </header>

      {/* Blog Content */}
      <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 md:p-12">
          <div className="prose prose-lg prose-blue max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                code({ inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg shadow-sm"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={`${className} bg-gray-100 px-2 py-1 rounded text-sm font-mono`} {...props}>
                      {children}
                    </code>
                  );
                },
                img: ({ ...props }) => (
                  <img className="rounded-xl shadow-lg max-w-full h-auto mx-auto" alt="" {...props} />
                ),
                h1: ({ ...props }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />
                ),
                h2: ({ ...props }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />
                ),
                h3: ({ ...props }) => (
                  <h3 className="text-xl font-bold text-gray-900 mt-5 mb-2" {...props} />
                ),
                p: ({ ...props }) => (
                  <p className="text-gray-800 leading-relaxed mb-4" {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-6 my-6 bg-blue-50 py-4 rounded-r-lg" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal list-inside text-gray-800 space-y-2 mb-4" {...props} />
                ),
                a: ({ ...props }) => (
                  <a className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2" {...props} />
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Thank you for reading! 📚</h3>
          <p className="text-gray-600 mb-6 text-lg">
            If you enjoyed this story, explore more amazing content from our community of writers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Discover More Stories
            </Link>
            <Link
              href={`/blogs/user/${blog.userId}`}
              className="text-blue-600 hover:text-blue-800 px-6 py-3 rounded-lg font-medium transition-colors border border-blue-200 hover:border-blue-300 hover:bg-blue-50"
            >
              More from {blog.username}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}