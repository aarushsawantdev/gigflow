// ─── User ─────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'sales';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Leads ────────────────────────────────────────────────────────────────────
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type SortOrder = 'latest' | 'oldest';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: { name: string; email: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export interface LeadFilters {
  page: number;
  limit: number;
  status: LeadStatus | '';
  source: LeadSource | '';
  search: string;
  sort: SortOrder;
}

// ─── API ──────────────────────────────────────────────────────────────────────
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: string[];
}

export interface LeadStats {
  total: number;
  byStatus: Array<{ _id: LeadStatus; count: number }>;
  bySource: Array<{ _id: LeadSource; count: number }>;
}

// ─── Forms ────────────────────────────────────────────────────────────────────
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
