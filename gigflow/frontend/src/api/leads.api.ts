import api from './axios';
import { ApiResponse, Lead, LeadFilters, LeadFormData, LeadStats } from '../types';

export const leadsApi = {
  getLeads: (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined) params.append(key, String(value));
    });
    return api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
  },

  getLeadById: (id: string) =>
    api.get<ApiResponse<Lead>>(`/leads/${id}`),

  createLead: (data: LeadFormData) =>
    api.post<ApiResponse<Lead>>('/leads', data),

  updateLead: (id: string, data: Partial<LeadFormData>) =>
    api.put<ApiResponse<Lead>>(`/leads/${id}`, data),

  deleteLead: (id: string) =>
    api.delete<ApiResponse<null>>(`/leads/${id}`),

  getStats: () =>
    api.get<ApiResponse<LeadStats>>('/leads/stats'),

  exportCSV: async (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined) params.append(key, String(value));
    });
    const response = await api.get(`/leads/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
