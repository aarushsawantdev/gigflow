import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadFilters, PaginationMeta } from '../types';
import { leadsApi } from '../api/leads.api';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  limit: 10,
  status: '',
  source: '',
  search: '',
  sort: 'latest',
};

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await leadsApi.getLeads({
        ...filters,
        search: debouncedSearch,
      });
      setLeads(response.data.data || []);
      setMeta(response.data.meta || null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch leads';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const updateFilters = (updates: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const deleteLead = async (id: string) => {
    try {
      await leadsApi.deleteLead(id);
      toast.success('Lead deleted successfully');
      void fetchLeads();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const exportCSV = async () => {
    try {
      await leadsApi.exportCSV({ ...filters, search: debouncedSearch });
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  return {
    leads,
    meta,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    resetFilters,
    deleteLead,
    exportCSV,
    refetch: fetchLeads,
  };
};
