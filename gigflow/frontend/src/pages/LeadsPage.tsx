import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LeadsTable from '../components/leads/LeadsTable';
import LeadFiltersBar from '../components/leads/LeadFiltersBar';
import LeadFormModal from '../components/leads/LeadFormModal';
import Pagination from '../components/ui/Pagination';
import { PageLoader } from '../components/ui/Spinner';
import { useLeads } from '../hooks/useLeads';
import { Lead } from '../types';

const LeadsPage = () => {
  const { leads, meta, filters, isLoading, error, updateFilters, setPage, resetFilters, deleteLead, exportCSV, refetch } = useLeads();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleView = (lead: Lead) => {
    setViewingLead(lead);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingLead(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Leads</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {meta ? `${meta.total} total leads` : 'Manage your leads'}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm">
              <Download size={15} />
              Export CSV
            </button>
            <button onClick={() => { setEditingLead(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={15} />
              Add Lead
            </button>
          </div>
        </div>

        {/* Filters */}
        <LeadFiltersBar filters={filters} onUpdate={updateFilters} onReset={resetFilters} />

        {/* Error State */}
        {error && (
          <div className="card p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <PageLoader />
        ) : (
          <LeadsTable
            leads={leads}
            onEdit={handleEdit}
            onDelete={deleteLead}
            onView={handleView}
          />
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}
      </div>

      {/* Lead Detail Modal */}
      {viewingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setViewingLead(null)}>
          <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Lead Details</h2>
              <button onClick={() => setViewingLead(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Name', viewingLead.name],
                ['Email', viewingLead.email],
                ['Status', viewingLead.status],
                ['Source', viewingLead.source],
                ['Notes', viewingLead.notes || '—'],
                ['Created', new Date(viewingLead.createdAt).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <span className="w-20 text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <LeadFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={refetch}
        lead={editingLead}
      />
    </DashboardLayout>
  );
};

export default LeadsPage;
