import React from 'react';
import { LeadStatus, LeadSource } from '../../types';

const STATUS_STYLES: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Qualified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const SOURCE_STYLES: Record<LeadSource, string> = {
  Website: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Instagram: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Referral: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
    {status}
  </span>
);

export const SourceBadge = ({ source }: { source: LeadSource }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SOURCE_STYLES[source]}`}>
    {source}
  </span>
);
