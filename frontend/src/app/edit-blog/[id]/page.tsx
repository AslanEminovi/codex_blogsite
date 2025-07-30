'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { Blog, BlogUpdateRequest } from '@/types';
import { blogsAPI } from '@/services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Eye, Edit } from 'lucide-react';

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const [id, setId] = useState<string | null>(null);
  
  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getId();
  }, [params]);
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BlogUpdateRequest>();

  const content = watch('content');
  const title = watch('title');
  const summary = watch('summary');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!id) return;

    const fetchBlog = async () => {
      try {
        const blogData = await blogsAPI.getById(parseInt(id));
        setBlog(blogData);
        
        // Pre-populate form with existing blog data
        setValue('title', blogData.title);
        setValue('summary', blogData.summary);
        setValue('content', blogData.content);
      } catch (err) {
        setError('Failed to load blog');
        console.error('Error fetching blog:', err);
      } finally {
        setIsLoadingBlog(false);
      }
    };

    fetchBlog();
  }, [user, router, id, setValue]);

  const onSubmit = async (data: BlogUpdateRequest) => {
    if (!user || !blog) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedBlog = await blogsAPI.update(blog.id, data);
      router.push(`/blog/${updatedBlog.id}`);
    } catch (err: unknown) {
      setError((err as { response?: { data?: string } })?.response?.data || 'Failed to update blog');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoadingBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h2>
          <button 
            onClick={() => router.back()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Edit Blog
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Update your story</p>
      </div>

      {/* Preview Toggle */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              !showPreview 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showPreview 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div className={`${showPreview ? 'hidden lg:block' : ''}`}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...register('title', {
                  required: 'Title is required',
                  maxLength: {
                    value: 200,
                    message: 'Title must be less than 200 characters',
                  },
                })}
                type="text"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your blog title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Summary */}
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                {...register('summary', {
                  maxLength: {
                    value: 500,
                    message: 'Summary must be less than 500 characters',
                  },
                })}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.summary ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief summary of your blog (optional)..."
              />
              {errors.summary && (
                <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content * (Markdown supported)
              </label>
              <textarea
                {...register('content', {
                  required: 'Content is required',
                })}
                rows={20}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Write your blog content here... (Markdown supported)"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
              {content && (
                <p className="mt-1 text-sm text-gray-500">
                  {content.length} characters
                </p>
              )}
              <div className="mt-2 text-xs text-gray-500">
                <p>Markdown supported: **bold**, *italic*, `code`, [links](url), ![images](url)</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Blog'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className={`${!showPreview ? 'hidden lg:block' : ''}`}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Preview
            </h2>
            <div className="prose prose-blue max-w-none">
              {title && <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>}
              {summary && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <p className="text-blue-800 italic">{summary}</p>
                </div>
              )}
              {content ? (
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
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={`${className} bg-gray-100 px-1 py-0.5 rounded text-sm`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    img: ({ ...props }) => (
                      <img className="rounded-lg shadow-sm max-w-full h-auto" alt="" {...props} />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500 italic">Start writing to see preview...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}