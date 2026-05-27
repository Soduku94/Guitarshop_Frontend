'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      authService.setToken(response.token);
      if (response.user) {
        authService.setUser(response.user);
      }
      
      // Chuyển hướng về trang chủ
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900 flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-dark-800 p-8 rounded-xl shadow-2xl border border-dark-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Đăng <span className="text-gold-500">Nhập</span></h2>
            <p className="text-gray-400 mt-2">Đăng nhập để tiếp tục trải nghiệm mua sắm</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-white"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-white"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-dark-900 bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Chưa có tài khoản?{' '}
              <a href="/register" className="text-gold-500 hover:text-gold-400 font-semibold transition-colors">
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
