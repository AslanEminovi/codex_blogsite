import axios from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  Blog, 
  BlogCreateRequest, 
  BlogUpdateRequest,
  User,
  AdminStats
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

// Blogs API
export const blogsAPI = {
  getAll: async (): Promise<Blog[]> => {
    const response = await api.get('/blogs');
    return response.data;
  },

  getById: async (id: number): Promise<Blog> => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  getByUser: async (userId: number): Promise<Blog[]> => {
    const response = await api.get(`/blogs/user/${userId}`);
    return response.data;
  },

  getMy: async (): Promise<Blog[]> => {
    const response = await api.get('/blogs/my');
    return response.data;
  },

  create: async (data: BlogCreateRequest): Promise<Blog> => {
    const response = await api.post('/blogs', data);
    return response.data;
  },

  update: async (id: number, data: BlogUpdateRequest): Promise<Blog> => {
    const response = await api.put(`/blogs/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/blogs/${id}`);
  },
};

// Admin API
export const adminAPI = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getBlogs: async (): Promise<Blog[]> => {
    const response = await api.get('/admin/blogs');
    return response.data;
  },

  deleteBlog: async (id: number): Promise<void> => {
    await api.delete(`/admin/blogs/${id}`);
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

export default api;