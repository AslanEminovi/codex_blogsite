export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  blogCount?: number;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: UserRole;
  userId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface BlogCreateRequest {
  title: string;
  content: string;
  summary: string;
}

export interface BlogUpdateRequest {
  title: string;
  content: string;
  summary: string;
}

export interface AdminStats {
  totalUsers: number;
  totalBlogs: number;
  totalAdmins: number;
  recentBlogs: number;
  topUsers: Array<{
    id: number;
    username: string;
    blogCount: number;
  }>;
}

export enum UserRole {
  User = 0,
  Admin = 1
}

export interface AuthContextType {
  user: AuthResponse | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}