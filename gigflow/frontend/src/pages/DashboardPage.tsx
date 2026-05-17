import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Target, XCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LeadStats } from '../../types';
import { leadsApi } from '../../api/leads.api';
import { PageLoader } from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({
  icon, label, value, color,
}: {
  icon: React.ReactNode; label: string; value: number | string; color: string;
}) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    leadsApi.getStats()
      .then((res) => setStats(res.data.data!))
      .catch(() => {/* silently fail */})
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusCount = (status: string) =>
    stats?.byStatus.find((s) => s._id === status)?.count ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Here's your leads overview
          </p>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Users size={20} className="text-blue-600" />}
                label="Total Leads"
                value={stats?.total ?? 0}
                color="bg-blue-50 dark:bg-blue-900/30"
              />
              <StatCard
                icon={<TrendingUp size={20} className="text-green-600" />}
                label="Qualified"
                value={getStatusCount('Qualified')}
                color="bg-green-50 dark:bg-green-900/30"
              />
              <StatCard
                icon={<Target size={20} className="text-yellow-600" />}
                label="Contacted"
                value={getStatusCount('Contacted')}
                color="bg-yellow-50 dark:bg-yellow-900/30"
              />
              <StatCard
                icon={<XCircle size={20} className="text-red-500" />}
                label="Lost"
                value={getStatusCount('Lost')}
                color="bg-red-50 dark:bg-red-900/30"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Breakdown */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Leads by Status</h3>
                <div className="space-y-3">
                  {stats?.byStatus.map((s) => (
                    <div key={s._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{s._id}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{s.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full transition-all"
                          style={{ width: `${((s.count / (stats?.total || 1)) * 100).toFixed(1)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Breakdown */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Leads by Source</h3>
                <div className="space-y-3">
                  {stats?.bySource.map((s) => (
                    <div key={s._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{s._id}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{s.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all"
                          style={{ width: `${((s.count / (stats?.total || 1)) * 100).toFixed(1)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
