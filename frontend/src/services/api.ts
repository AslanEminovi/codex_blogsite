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
    if (token && config.headers) {
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
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};

// Blogs API
export const blogsAPI = {
  getAll: async (): Promise<Blog[]> => {
    const response = await api.get<Blog[]>('/blogs');
    return response.data;
  },

  getById: async (id: number): Promise<Blog> => {
    const response = await api.get<Blog>(`/blogs/${id}`);
    return response.data;
  },

  getByUser: async (userId: number): Promise<Blog[]> => {
    const response = await api.get<Blog[]>(`/blogs/user/${userId}`);
    return response.data;
  },

  getMy: async (): Promise<Blog[]> => {
    const response = await api.get<Blog[]>('/blogs/my');
    return response.data;
  },

  create: async (data: BlogCreateRequest): Promise<Blog> => {
    const response = await api.post<Blog>('/blogs', data);
    return response.data;
  },

  update: async (id: number, data: BlogUpdateRequest): Promise<Blog> => {
    const response = await api.put<Blog>(`/blogs/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/blogs/${id}`);
  },
};

// Admin API
export const adminAPI = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  },

  getBlogs: async (): Promise<Blog[]> => {
    const response = await api.get<Blog[]>('/admin/blogs');
    return response.data;
  },

  deleteBlog: async (id: number): Promise<void> => {
    await api.delete(`/admin/blogs/${id}`);
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>('/admin/stats');
    return response.data;
  },
};

// Favorites API
export const favoritesAPI = {
  getMyFavorites: async (): Promise<Blog[]> => {
    const response = await api.get<Blog[]>('/favorites');
    return response.data;
  },

  addToFavorites: async (blogId: number): Promise<void> => {
    await api.post(`/favorites/${blogId}`);
  },

  removeFromFavorites: async (blogId: number): Promise<void> => {
    await api.delete(`/favorites/${blogId}`);
  },

  checkIsFavorited: async (blogId: number): Promise<boolean> => {
    const response = await api.get<boolean>(`/favorites/check/${blogId}`);
    return response.data;
  },
};

export default api;