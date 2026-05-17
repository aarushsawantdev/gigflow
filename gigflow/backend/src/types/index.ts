// ─── User Types ───────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'sales';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPayload {
  id: string;
  email: string;
  role: UserRole;
}

// ─── Lead Types ───────────────────────────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Query Types ──────────────────────────────────────────────────────────────

export interface LeadQueryParams {
  page?: string;
  limit?: string;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
}

// ─── API Response Types ───────────────────────────────────────────────────────

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

// ─── Express Extension ────────────────────────────────────────────────────────

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: IUserPayload;
}
