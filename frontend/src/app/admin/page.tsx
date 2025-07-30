'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, Blog, AdminStats, UserRole } from '@/types';
import { adminAPI } from '@/services/api';
import { format } from 'date-fns';
import { Users, FileText, Shield, TrendingUp, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  type TabType = 'stats' | 'users' | 'blogs';
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user || user.role !== UserRole.Admin) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsData, usersData, blogsData] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getUsers(),
          adminAPI.getBlogs(),
        ]);
        setStats(statsData);
        setUsers(usersData);
        setBlogs(blogsData);
      } catch (err) {
        setError('Failed to load admin data');
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their blogs.')) {
      return;
    }

    setDeletingId(userId);
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setBlogs(blogs.filter(b => b.userId !== userId));
    } catch (err) {
      alert('Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteBlog = async (blogId: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    setDeletingId(blogId);
    try {
      await adminAPI.deleteBlog(blogId);
      setBlogs(blogs.filter(b => b.id !== blogId));
    } catch (err) {
      alert('Failed to delete blog');
      console.error('Error deleting blog:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user || user.role !== UserRole.Admin) {
    return null; // Will redirect
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users, blogs, and monitor site statistics</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'stats', label: 'Statistics', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'blogs', label: 'Blogs', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as TabType)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Statistics Tab */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent Blogs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentBlogs}</p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Top Content Creators</h3>
            </div>
            <div className="px-6 py-4">
              {stats.topUsers.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {stats.topUsers.map((user) => (
                    <li key={user.id} className="py-3 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{user.username}</span>
                      <span className="text-sm text-gray-500">{user.blogCount} blogs</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No users with blogs yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                        {user.role === UserRole.Admin && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Joined {format(new Date(user.createdAt), 'MMM d, yyyy')} • {user.blogCount || 0} blogs
                      </p>
                    </div>
                  </div>
                  
                  {user.role !== UserRole.Admin && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deletingId === user.id}
                      className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50"
                      title="Delete user"
                    >
                      {deletingId === user.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Blogs Tab */}
      {activeTab === 'blogs' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <li key={blog.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{blog.title}</p>
                    <p className="text-sm text-gray-600">By {blog.username}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/blog/${blog.id}`}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View blog"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}