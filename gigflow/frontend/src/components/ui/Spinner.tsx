import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };

const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => (
  <div
    className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-300 border-t-brand-500 ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
);

export const ButtonSpinner = () => <Spinner size="sm" className="inline-block mr-2" />;

export default Spinner;
