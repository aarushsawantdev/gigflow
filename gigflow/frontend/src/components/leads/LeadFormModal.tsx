import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Lead, LeadFormData, LeadStatus, LeadSource } from '../../types';
import { leadsApi } from '../../api/leads.api';
import toast from 'react-hot-toast';
import { ButtonSpinner } from '../ui/Spinner';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead?: Lead | null;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const INITIAL_FORM: LeadFormData = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website',
  notes: '',
};

const LeadFormModal = ({ isOpen, onClose, onSuccess, lead }: LeadFormModalProps) => {
  const [form, setForm] = useState<LeadFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lead) {
      setForm({ name: lead.name, email: lead.email, status: lead.status, source: lead.source, notes: lead.notes || '' });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [lead, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<LeadFormData> = {};
    if (!form.name.trim() || form.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Valid email is required';
    if (!form.source) newErrors.source = 'Source is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (lead) {
        await leadsApi.updateLead(lead._id, form);
        toast.success('Lead updated!');
      } else {
        await leadsApi.createLead(form);
        toast.success('Lead created!');
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="input-field"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="input-field"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as LeadStatus }))}
                className="input-field"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source *</label>
              <select
                value={form.source}
                onChange={(e) => setForm((p) => ({ ...p, source: e.target.value as LeadSource }))}
                className="input-field"
              >
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              className="input-field resize-none"
              rows={3}
              placeholder="Optional notes..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting && <ButtonSpinner />}
              {lead ? 'Update' : 'Create'} Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
