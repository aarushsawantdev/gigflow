import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import { RegisterForm, UserRole } from '../types';
import toast from 'react-hot-toast';
import { ButtonSpinner } from '../components/ui/Spinner';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    name: '', email: '', password: '', role: 'sales',
  });
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const e: Partial<RegisterForm> = {};
    if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await authApi.register(form);
      const { token, user } = res.data.data!;
      login(token, user);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-600 dark:text-brand-400">GigFlow</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Smart Leads Dashboard</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Create account</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Join GigFlow to manage your leads</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="input-field"
                placeholder="Min. 6 characters"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as UserRole }))}
                className="input-field"
              >
                <option value="sales">Sales User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
              {isLoading && <ButtonSpinner />}
              Create Account
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
