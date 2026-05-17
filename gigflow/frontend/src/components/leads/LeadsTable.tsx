import React from 'react';
import { Edit2, Trash2, Eye, Users } from 'lucide-react';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
}

const LeadsTable = ({ leads, onEdit, onDelete, onView }: LeadsTableProps) => {
  const { user } = useAuth();

  if (leads.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <Users size={40} className="text-gray-300 dark:text-gray-600 mb-3" />
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No leads found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your filters or add a new lead.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-semibold">
                      {lead.name[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{lead.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.email}</td>
                <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                  {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onView(lead)}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all"
                      title="View details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onEdit(lead)}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-400 transition-all"
                      title="Edit lead"
                    >
                      <Edit2 size={14} />
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this lead? This cannot be undone.')) {
                            onDelete(lead._id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all"
                        title="Delete lead"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;
