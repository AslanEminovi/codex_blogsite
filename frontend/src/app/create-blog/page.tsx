'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { BlogCreateRequest } from '@/types';
import { blogsAPI } from '@/services/api';

export default function CreateBlogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BlogCreateRequest>();

  const content = watch('content');

  const onSubmit = async (data: BlogCreateRequest) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const blog = await blogsAPI.create(data);
      router.push(`/blog/${blog.id}`);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to create blog');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
        <p className="text-gray-600 mt-2">Share your thoughts with the world</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md">
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
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
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
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.summary ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Brief summary of your blog (optional)..."
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            A brief summary will help readers understand what your blog is about.
          </p>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            {...register('content', {
              required: 'Content is required',
            })}
            rows={15}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.content ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Write your blog content here..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
          {content && (
            <p className="mt-1 text-sm text-gray-500">
              {content.length} characters
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                // Save as draft functionality can be added later
                alert('Draft functionality coming soon!');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save as Draft
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publishing...
                </div>
              ) : (
                'Publish Blog'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}