'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { LogOut, User, BookOpen, Settings, PlusCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">BlogSite</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              
              {user && (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    My Dashboard
                  </Link>
                  
                  <Link 
                    href="/create-blog" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>New Blog</span>
                  </Link>
                  
                  {user.role === UserRole.Admin && (
                    <Link 
                      href="/admin" 
                      className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && (
          <div className="md:hidden pb-3 pt-2 border-t border-gray-200">
            <div className="flex flex-col space-y-1">
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-sm font-medium"
              >
                My Dashboard
              </Link>
              <Link 
                href="/create-blog" 
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-sm font-medium"
              >
                Create Blog
              </Link>
              {user.role === UserRole.Admin && (
                <Link 
                  href="/admin" 
                  className="text-gray-700 hover:text-red-600 block px-3 py-2 text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;