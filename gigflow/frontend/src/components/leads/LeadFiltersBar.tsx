import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { LeadFilters, LeadStatus, LeadSource, SortOrder } from '../../types';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onUpdate: (updates: Partial<LeadFilters>) => void;
  onReset: () => void;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const LeadFiltersBar = ({ filters, onUpdate, onReset }: LeadFiltersBarProps) => {
  const hasActiveFilters = filters.status || filters.source || filters.search;

  return (
    <div className="card p-4 space-y-3">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search name or email..."
            value={filters.search}
            onChange={(e) => onUpdate({ search: e.target.value })}
            className="input-field pl-9"
          />
          {filters.search && (
            <button
              onClick={() => onUpdate({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={(e) => onUpdate({ status: e.target.value as LeadStatus | '' })}
          className="input-field w-auto min-w-[130px]"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Source filter */}
        <select
          value={filters.source}
          onChange={(e) => onUpdate({ source: e.target.value as LeadSource | '' })}
          className="input-field w-auto min-w-[130px]"
        >
          <option value="">All Sources</option>
          {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => onUpdate({ sort: e.target.value as SortOrder })}
          className="input-field w-auto min-w-[120px]"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default LeadFiltersBar;
